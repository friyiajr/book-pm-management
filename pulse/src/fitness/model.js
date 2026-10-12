export const dayKey = date => {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export function weekDays(now = new Date()) {
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  return Array.from({
    length: 7
  }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}
export const ownWorkouts = (state, userId) => state.workouts.filter(w => w.userId === userId);
export function addWorkout(state, userId, workout) {
  return {
    ...state,
    workouts: [...state.workouts, {
      ...workout,
      id: crypto.randomUUID(),
      userId
    }]
  };
}
export function stats(workouts, now = new Date()) {
  const days = weekDays(now);
  const counts = days.map(d => workouts.filter(w => dayKey(w.date) === dayKey(d)).length);
  const dates = new Set(workouts.map(w => dayKey(w.date)));
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  if (!dates.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return {
    days,
    counts,
    weekly: counts.reduce((a, b) => a + b, 0),
    streak,
    total: workouts.length
  };
}
export function initialData() {
  return { goal: null, workouts: [] };
}
// Remove generated starter records from earlier versions, preserving logged workouts.
export function removeStarterData(saved) {
  const hadStarterData = saved.workouts.some(w => typeof w.id === 'string' && /^sample-\d+$/.test(w.id));
  return {
    ...saved,
    goal: hadStarterData && (saved.goal === 3 || (saved.goal?.mode === 'weekly' && saved.goal.title === '3 workouts a week')) ? null : saved.goal,
    workouts: saved.workouts.filter(w => !(typeof w.id === 'string' && /^sample-\d+$/.test(w.id))),
  };
}
