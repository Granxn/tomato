export function calculatePriority(task) {
  const { importance = 1, urgency = 1, due_date, estimate_pomodori = 1, labels = [] } = task
  
  // Base scores (0-100)
  const importanceScore = (importance / 5) * 35
  const urgencyScore = (urgency / 5) * 25
  
  // Due date proximity (30%)
  let dueDateScore = 0
  if (due_date) {
    const daysUntilDue = Math.ceil((new Date(due_date) - new Date()) / (1000 * 60 * 60 * 24))
    if (daysUntilDue <= 1) dueDateScore = 30
    else if (daysUntilDue <= 3) dueDateScore = 20
    else if (daysUntilDue <= 7) dueDateScore = 10
    else dueDateScore = 5
  }
  
  // Effort penalty (10%)
  const effortPenalty = Math.min((estimate_pomodori - 1) * 2, 10)
  
  // Blocker bonus
  const blockerBonus = labels.includes('blocker') ? 20 : 0
  
  const totalScore = Math.min(100, importanceScore + urgencyScore + dueDateScore - effortPenalty + blockerBonus)
  
  let priorityLabel = 'Low'
  if (totalScore >= 70) priorityLabel = 'High'
  else if (totalScore >= 40) priorityLabel = 'Medium'
  
  return {
    score: Math.round(totalScore),
    label: priorityLabel,
    breakdown: {
      importance: Math.round(importanceScore),
      urgency: Math.round(urgencyScore),
      dueDate: Math.round(dueDateScore),
      effort: Math.round(effortPenalty),
      blocker: blockerBonus
    }
  }
}
