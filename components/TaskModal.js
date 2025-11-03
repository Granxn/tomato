import { useState, useEffect } from 'react'
import { calculatePriority } from '../lib/priority'

export default function TaskModal({ task, columns, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    column_id: columns[0]?.id || '',
    due_date: '',
    estimate_pomodori: 1,
    importance: 3,
    urgency: 3,
    labels: []
  })
  const [labelInput, setLabelInput] = useState('')
  const [previewPriority, setPreviewPriority] = useState(null)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        column_id: task.column_id || columns[0]?.id || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        estimate_pomodori: task.estimate_pomodori || 1,
        importance: task.importance || 3,
        urgency: task.urgency || 3,
        labels: task.labels || []
      })
    }
  }, [task, columns])

  useEffect(() => {
    const priority = calculatePriority(formData)
    setPreviewPriority(priority)
  }, [formData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const addLabel = () => {
    if (labelInput.trim() && !formData.labels.includes(labelInput.trim())) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, labelInput.trim()]
      }))
      setLabelInput('')
    }
  }

  const removeLabel = (label) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(l => l !== label)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          {task ? 'Edit Task' : 'Create Task'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-tomato focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-tomato focus:border-transparent"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Column</label>
            <select
              value={formData.column_id}
              onChange={(e) => setFormData(prev => ({ ...prev, column_id: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-tomato focus:border-transparent"
            >
              {columns.map(column => (
                <option key={column.id} value={column.id}>{column.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-tomato focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estimate 🍅</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.estimate_pomodori}
                onChange={(e) => setFormData(prev => ({ ...prev, estimate_pomodori: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-tomato focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Importance (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.importance}
                onChange={(e) => setFormData(prev => ({ ...prev, importance: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">{formData.importance}/5</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Urgency (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.urgency}
                onChange={(e) => setFormData(prev => ({ ...prev, urgency: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">{formData.urgency}/5</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Labels</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                placeholder="Add label..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-tomato focus:border-transparent"
              />
              <button
                type="button"
                onClick={addLabel}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.labels.map(label => (
                <span
                  key={label}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => removeLabel(label)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {previewPriority && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium mb-2">Priority Preview:</div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  previewPriority.label === 'High' ? 'bg-red-100 text-red-800' :
                  previewPriority.label === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {previewPriority.label} ({previewPriority.score})
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Importance: {previewPriority.breakdown.importance}, 
                Urgency: {previewPriority.breakdown.urgency}, 
                Due Date: {previewPriority.breakdown.dueDate}, 
                Effort: -{previewPriority.breakdown.effort}
                {previewPriority.breakdown.blocker > 0 && `, Blocker: +${previewPriority.breakdown.blocker}`}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-tomato text-white py-2 rounded-lg hover:bg-red-600"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
