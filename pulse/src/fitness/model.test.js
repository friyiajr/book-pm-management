import test from 'node:test';
import assert from 'node:assert/strict';
import { addWorkout, dayKey, initialData, ownWorkouts, stats, removeStarterData } from './model.js';
const now = new Date(2026, 9, 14, 12);
test('profile ownership cannot be overwritten by submitted workout data', () => {
  const before = {
    goal: 3,
    workouts: [{
      id: 'b',
      userId: 'sam',
      title: 'B workout',
      date: '2026-10-14',
      duration: 30
    }]
  };
  const after = addWorkout(before, 'alex', {
    userId: 'sam',
    title: 'A workout',
    date: '2026-10-14',
    duration: 45
  });
  assert.equal(ownWorkouts(after, 'alex').length, 1);
  assert.deepEqual(ownWorkouts(after, 'sam'), before.workouts);
  assert.equal(before.workouts.length, 1);
});
test('multiple workouts in a day update counts while streak counts days', () => {
  const workouts = ['2026-10-14', '2026-10-14', '2026-10-13'].map(date => ({
    date
  }));
  const result = stats(workouts, now);
  assert.equal(result.total, 3);
  assert.equal(result.weekly, 3);
  assert.equal(result.counts[2], 2);
  assert.equal(result.streak, 2);
});
test('streak grace day, gaps, week boundaries and year boundaries', () => {
  assert.equal(stats([], now).streak, 0);
  assert.equal(stats([{
    date: '2026-10-13'
  }], now).streak, 1);
  assert.equal(stats([{
    date: '2026-10-12'
  }], now).streak, 0);
  assert.equal(stats([{
    date: '2026-10-11'
  }], now).weekly, 0);
  assert.equal(stats([{
    date: '2026-12-31'
  }, {
    date: '2027-01-01'
  }], new Date(2027, 0, 1, 12)).streak, 2);
});
test('date-only input retains its calendar day and fresh profiles start empty', () => {
  assert.equal(dayKey('2026-10-14'), '2026-10-14');
  assert.deepEqual(initialData('sam', now), {
    goal: null,
    workouts: []
  });
});

test('all profiles start at zero, without a goal or generated workouts', () => {
  for (const user of ['alex', 'sam']) {
    const state = initialData(user);
    assert.deepEqual(state, { goal: null, workouts: [] });
    const progress = stats(state.workouts, now);
    assert.equal(progress.total, 0);
    assert.equal(progress.weekly, 0);
    assert.equal(progress.streak, 0);
    assert.deepEqual(progress.counts, [0, 0, 0, 0, 0, 0, 0]);
    const logged = addWorkout(state, user, { title: 'My first workout', date: dayKey(now), duration: 20 });
    assert.equal(stats(logged.workouts, now).total, 1);
    assert.equal(stats(logged.workouts, now).weekly, 1);
    assert.equal(stats(logged.workouts, now).streak, 1);
  }
});

test('legacy starter migration removes samples but preserves logged workouts and custom goals', () => {
  const logged = { id: 'logged-123', userId: 'alex', title: 'My walk' };
  const workouts = [{ id: 'sample-0', userId: 'alex' }, logged];
  assert.deepEqual(removeStarterData({ goal: 3, workouts }), { goal: null, workouts: [logged] });
  const goal = { title: 'Run farther', mode: 'target', current: 0, target: 5 };
  assert.deepEqual(removeStarterData({ goal, workouts }), { goal, workouts: [logged] });
  assert.deepEqual(removeStarterData({ goal: 3, workouts: [logged] }), { goal: 3, workouts: [logged] });
});
