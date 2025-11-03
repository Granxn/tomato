import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

export default function KanbanColumn({ column, tasks, onEditTask, onDeleteTask }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  const getColumnColor = () => {
    switch (column.title.toLowerCase()) {
      case 'to do': return 'border-gray-300'
      case 'doing': return 'border-yellow-400'
      case 'done': return 'border-leaf'
      default: return 'border-gray-300'
    }
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 border-2 ${getColumnColor()}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-dark">{column.title}</h3>
        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="min-h-[200px] space-y-3"
      >
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks
            .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
            .map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
        </SortableContext>
      </div>
    </div>
  )
}
