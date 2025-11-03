import { useState, useEffect } from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { supabase } from '../lib/supabase'
import { calculatePriority } from '../lib/priority'
import KanbanColumn from './KanbanColumn'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'

export default function KanbanBoard({ boardId, userId }) {
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])
  const [activeTask, setActiveTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    loadBoard()
  }, [boardId])

  const loadBoard = async () => {
    // Load columns
    const { data: columnsData } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', boardId)
      .order('position')

    // Load tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .in('column_id', columnsData?.map(c => c.id) || [])

    setColumns(columnsData || [])
    setTasks(tasksData || [])
  }

  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id
    const newColumnId = over.id

    // Update task column
    await supabase
      .from('tasks')
      .update({ column_id: newColumnId })
      .eq('id', taskId)

    // Update local state
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, column_id: newColumnId } : task
    ))
  }

  const createTask = async (taskData) => {
    const priority = calculatePriority(taskData)
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...taskData,
        priority_score: priority.score,
        priority_label: priority.label
      }])
      .select()

    if (!error && data) {
      setTasks(prev => [...prev, data[0]])
    }
  }

  const updateTask = async (taskId, taskData) => {
    const priority = calculatePriority(taskData)
    
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...taskData,
        priority_score: priority.score,
        priority_label: priority.label
      })
      .eq('id', taskId)
      .select()

    if (!error && data) {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? data[0] : task
      ))
    }
  }

  const deleteTask = async (taskId) => {
    await supabase.from('tasks').delete().eq('id', taskId)
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const suggestPriorities = async () => {
    const updatedTasks = tasks.map(task => {
      const priority = calculatePriority(task)
      return {
        ...task,
        priority_score: priority.score,
        priority_label: priority.label
      }
    })

    // Batch update
    for (const task of updatedTasks) {
      await supabase
        .from('tasks')
        .update({
          priority_score: task.priority_score,
          priority_label: task.priority_label
        })
        .eq('id', task.id)
    }

    setTasks(updatedTasks)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark">Task Board</h2>
        <div className="flex space-x-2">
          <button
            onClick={suggestPriorities}
            className="px-4 py-2 bg-tomato text-white rounded-lg hover:bg-red-600"
          >
            🤖 Suggest All Priorities
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-leaf text-white rounded-lg hover:bg-green-600"
          >
            + Add Task
          </button>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks.filter(task => task.column_id === column.id)}
              onEditTask={(task) => {
                setEditingTask(task)
                setShowTaskModal(true)
              }}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          columns={columns}
          onSave={editingTask ? 
            (data) => updateTask(editingTask.id, data) : 
            createTask
          }
          onClose={() => {
            setShowTaskModal(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}
