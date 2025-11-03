import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task, onEdit, onDelete, isDragging = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString()
  }

  const isOverdue = (dateString) => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-4 shadow-sm border cursor-grab hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-dark text-sm">{task.title}</h4>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.()
            }}
            className="text-gray-400 hover:text-gray-600 text-xs"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.()
            }}
            className="text-gray-400 hover:text-red-600 text-xs"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {task.priority_label && (
          <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority_label)}`}>
            {task.priority_label} ({task.priority_score})
          </span>
        )}
        
        {task.labels?.map(label => (
          <span key={label} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {label}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {task.estimate_pomodori && (
            <span>🍅 {task.estimate_pomodori}</span>
          )}
          {task.importance && (
            <span>⭐ {task.importance}/5</span>
          )}
          {task.urgency && (
            <span>⚡ {task.urgency}/5</span>
          )}
        </div>
        
        {task.due_date && (
          <span className={isOverdue(task.due_date) ? 'text-red-600 font-medium' : ''}>
            📅 {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  )
}
