// Numeric goals from the first prototype migrate without losing workout history.
export function normalizeGoal(value) {
  if (Number.isInteger(value) && value > 0) {
    return { title: `${value} workouts a week`, mode: 'weekly', target: value, current: 0, unit: 'workouts', notes: '', completed: false };
  }
  if (!value || typeof value !== 'object' || typeof value.title !== 'string' || !value.title.trim() || !['weekly', 'target', 'milestone'].includes(value.mode)) return null;
  if (value.mode !== 'milestone' && (!Number.isFinite(value.target) || value.target <= 0)) return null;
  if (value.mode === 'weekly' && !Number.isInteger(value.target)) return null;
  if (value.mode === 'target' && (!Number.isFinite(value.current) || value.current < 0)) return null;
  return { title: value.title.trim().slice(0, 120), mode: value.mode, target: value.mode === 'milestone' ? 1 : value.target, current: value.mode === 'target' ? value.current : 0, unit: value.mode === 'weekly' ? 'workouts' : typeof value.unit === 'string' ? value.unit.slice(0, 24) : '', notes: typeof value.notes === 'string' ? value.notes.slice(0, 500) : '', completed: value.completed === true };
}
export function goalProgress(goal, weeklyCount) {
  if (!goal) return { current: 0, target: 0, percent: 0, reached: false };
  const current = goal.mode === 'weekly' ? weeklyCount : goal.mode === 'milestone' ? Number(goal.completed) : goal.current;
  const target = goal.mode === 'milestone' ? 1 : goal.target;
  return { current, target, percent: Math.min(100, current / target * 100), reached: current >= target };
}
