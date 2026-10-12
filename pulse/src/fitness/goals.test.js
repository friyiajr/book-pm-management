import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeGoal, goalProgress } from './goals.js';
test('existing numeric weekly goals migrate and still count workouts automatically', () => {
  const goal = normalizeGoal(3);
  assert.equal(goal.title, '3 workouts a week');
  assert.equal(goal.mode, 'weekly');
  assert.equal(goalProgress(goal, 2).current, 2);
  assert.equal(goalProgress(goal, 4).percent, 100);
  assert.equal(goalProgress(goal, 4).reached, true);
});
test('distance and weight progress are independent of workout totals and preserve decimals', () => {
  for (const unit of ['km', 'kg', 'laps']) {
    const goal = normalizeGoal({ title: 'My custom goal', mode: 'target', target: 5, current: 2.5, unit });
    assert.equal(goal.unit, unit);
    assert.deepEqual(goalProgress(goal, 50), { current: 2.5, target: 5, percent: 50, reached: false });
    assert.equal(goalProgress({ ...goal, current: 6 }, 0).reached, true);
  }
});
test('freeform milestones need no numeric metric and support completion and reopening', () => {
  const goal = normalizeGoal({ title: 'Feel confident at the gym', mode: 'milestone', notes: 'Try the free weights area.' });
  assert.equal(goalProgress(goal, 50).reached, false);
  assert.equal(goalProgress({ ...goal, completed: true }, 0).percent, 100);
  assert.equal(goalProgress({ ...goal, completed: false }, 0).percent, 0);
  assert.equal(goal.notes, 'Try the free weights area.');
  assert.deepEqual(normalizeGoal(JSON.parse(JSON.stringify(goal))), goal);
});
test('invalid goals cannot produce broken progress calculations', () => {
  assert.equal(normalizeGoal(null), null);
  assert.equal(normalizeGoal({ title: '  ', mode: 'milestone' }), null);
  for (const target of [0, -1, Infinity, NaN]) assert.equal(normalizeGoal({ title: 'Run', mode: 'target', target, current: 0 }), null);
  assert.equal(normalizeGoal({ title: 'Run', mode: 'target', target: 5, current: -1 }), null);
  assert.equal(normalizeGoal({ title: 'Move', mode: 'weekly', target: 2.5 }), null);
  assert.equal(goalProgress(null, 8).percent, 0);
});
