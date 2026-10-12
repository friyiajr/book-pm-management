import { useEffect, useState } from 'react';
import { addWorkout, initialData, ownWorkouts, removeStarterData } from './model';
import { normalizeGoal } from './goals';
const key = user => `yorku.fitness.v1.${user}`;
function read(user) {
  try {
    let saved = JSON.parse(localStorage.getItem(key(user)));
    if (saved && Array.isArray(saved.workouts)) {
      saved = removeStarterData(saved);
      return {
        goal: normalizeGoal(saved.goal),
        workouts: saved.workouts.filter(w => w.userId === user && typeof w.title === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(w.date) && Number.isFinite(w.duration))
      };
    }
  } catch {/* A demo can start again if browser storage is unavailable. */}
  const initial = initialData(user);
  return { ...initial, goal: normalizeGoal(initial.goal) };
}
export default function useFitness(user) {
  const [state, setState] = useState(() => read(user));
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key(user), JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [user, state]);
  return {
    workouts: ownWorkouts(state, user),
    goal: state.goal,
    storageError,
    reset: () => setState(initialData()),
    log: workout => setState(prev => addWorkout(prev, user, workout)),
    setGoal: goal => setState(prev => ({
      ...prev,
      goal
    }))
  };
}
