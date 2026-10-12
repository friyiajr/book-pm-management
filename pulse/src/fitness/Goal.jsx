import React, { useState } from 'react';
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { CheckRounded, FlagOutlined } from '@mui/icons-material';
import { goalProgress, normalizeGoal } from './goals';
const muted = { color: 'text.secondary', fontSize: '.78rem' };
const blank = { title: '', mode: 'milestone', current: 0, target: 0, unit: '', notes: '', completed: false };
export function GoalCard({ goal, weeklyCount, onEdit, onSave }) {
  const p = goalProgress(goal, weeklyCount);
  const milestone = goal?.mode === 'milestone';
  return <>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
      <Typography variant="h2">Your fitness goal</Typography>
      <Button size="small" onClick={onEdit}>{goal ? 'Edit goal' : 'Set goal'} →</Button>
    </Stack>
    <Stack direction="row" alignItems="center" spacing={2.5}>
      <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
        <CircularProgress variant="determinate" value={100} size={120} thickness={4} sx={{ color: '#F3E6E9' }} aria-hidden="true" />
        <CircularProgress variant="determinate" value={p.percent} size={120} thickness={4} sx={{ position: 'absolute', left: 0, '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} aria-label={!goal ? 'No goal set' : milestone ? p.reached ? 'Goal complete' : 'Personal goal in progress' : `${p.current} of ${p.target} ${goal.unit}`} />
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1.5 }}>
          {!goal || milestone ? p.reached ? <CheckRounded sx={{ color: 'success.main', fontSize: 32 }} /> : <FlagOutlined sx={{ color: 'primary.main', fontSize: 32 }} /> : <Typography sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.35rem', overflowWrap: 'anywhere', textAlign: 'center', lineHeight: 1.2 }}>{p.current}<Box component="span" sx={{ fontSize: '.85rem', color: 'text.secondary', fontWeight: 400 }}> / {p.target}</Box></Typography>}
          <Typography sx={{ ...muted, fontSize: '.66rem', mt: .5, textAlign: 'center', overflowWrap: 'anywhere', maxWidth: 90 }}>{!goal ? 'Your own pace' : milestone ? p.reached ? 'Achieved' : 'Personal goal' : goal.unit || 'progress'}</Typography>
        </Box>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Chip size="small" label={p.reached ? 'GOAL COMPLETE' : goal ? 'IN PROGRESS' : 'YOUR OWN PACE'} sx={{ bgcolor: p.reached ? '#EAF5EF' : '#FFF0F2', color: p.reached ? 'success.main' : 'primary.main', fontSize: '.59rem', fontWeight: 600 }} />
        <Typography sx={{ fontWeight: 600, fontSize: '.98rem', mt: 1.5, overflowWrap: 'anywhere' }}>{goal?.title || 'What would you like to work toward?'}</Typography>
        <Typography sx={{ ...muted, mt: .6 }}>{p.reached ? 'You made time for yourself. Celebrate that!' : !goal ? 'Run farther, lift heavier, or try something new. Make it yours.' : goal.mode === 'weekly' ? `${Math.max(0, p.target - p.current)} more ${p.target - p.current === 1 ? 'workout' : 'workouts'} this week. You’ve got this.` : milestone ? 'One step at a time. You decide what success looks like.' : 'Your progress, at your own pace.'}</Typography>
        {goal && goal.mode !== 'weekly' && <Button size="small" sx={{ mt: 1, p: 0, justifyContent: 'flex-start' }} onClick={milestone ? () => onSave({ ...goal, completed: !goal.completed }) : onEdit}>{milestone ? p.reached ? 'Mark as in progress' : 'Mark as achieved' : 'Update progress'}</Button>}
      </Box>
    </Stack>
    {goal?.notes && <Typography sx={{ ...muted, mt: 2, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{goal.notes}</Typography>}
    <Divider sx={{ mt: 2.5, mb: 1.5 }} />
    <Typography sx={{ ...muted, fontSize: '.7rem' }}>{goal?.mode === 'weekly' ? 'Updates automatically from workouts logged Monday to Sunday.' : goal?.mode === 'target' ? 'Update your current result when you make progress. Workout logs are tracked separately.' : 'Your goal can be anything that matters to you. Change it whenever life changes.'}</Typography>
  </>;
}
export function GoalDialog({ goal, onClose, onSave }) {
  const [draft, setDraft] = useState(goal || blank);
  const change = (field, value) => setDraft(prev => ({ ...prev, [field]: value }));
  const presets = [
    ['Run farther', { ...blank, title: 'Run 5 km without stopping', mode: 'target', target: 5, unit: 'km' }],
    ['Lift heavier', { ...blank, title: 'Build my squat to 60 kg', mode: 'target', target: 60, unit: 'kg' }],
    ['Build consistency', { ...blank, title: 'Move 3 times a week', mode: 'weekly', target: 3, unit: 'workouts' }],
    ['Something else', blank],
  ];
  return <Dialog open onClose={onClose} fullWidth maxWidth="xs">
    <Box component="form" onSubmit={e => {
      e.preventDefault();
      const next = normalizeGoal({ ...draft, target: Number(draft.target), current: Number(draft.current) });
      if (next) onSave(next);
    }}>
      <DialogTitle>{goal ? 'Edit your fitness goal' : 'Make your goal your own'}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Run farther, lift heavier, feel more confident. Choose what matters to you.</Typography>
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mb: 3 }} aria-label="Goal ideas">
          {presets.map(([label, value]) => <Chip key={label} label={label} variant="outlined" onClick={() => setDraft(value)} />)}
        </Stack>
        <Stack spacing={2.5}>
          <TextField fullWidth required autoFocus label="My goal" placeholder="e.g. Feel confident in the weight room" value={draft.title} onChange={e => change('title', e.target.value)} slotProps={{ htmlInput: { maxLength: 120 } }} />
          <TextField select fullWidth label="How would you like to track it?" value={draft.mode} onChange={e => change('mode', e.target.value)}>
            <MenuItem value="milestone">Personal milestone · I’ll mark it achieved</MenuItem>
            <MenuItem value="target">Number target · I’ll update my progress</MenuItem>
            <MenuItem value="weekly">Weekly workouts · Track automatically</MenuItem>
          </TextField>
          {draft.mode === 'weekly' && <TextField required type="number" label="Workouts per week" value={draft.target} onChange={e => change('target', e.target.value)} slotProps={{ htmlInput: { min: 1, step: 1 } }} />}
          {draft.mode === 'target' && <>
            <TextField label="Unit (optional)" placeholder="km, kg, minutes, laps…" value={draft.unit} onChange={e => change('unit', e.target.value)} slotProps={{ htmlInput: { maxLength: 24 } }} />
            <Stack direction="row" spacing={2}>
              <TextField required type="number" label="Current result" value={draft.current} onChange={e => change('current', e.target.value)} slotProps={{ htmlInput: { min: 0, step: 'any' } }} />
              <TextField required type="number" label="Target" value={draft.target} onChange={e => change('target', e.target.value)} slotProps={{ htmlInput: { min: 0.000001, step: 'any' } }} />
            </Stack>
          </>}
          <TextField multiline minRows={2} label="What does success look like? (optional)" placeholder="Your motivation, a milestone, or a date to aim for…" value={draft.notes} onChange={e => change('notes', e.target.value)} slotProps={{ htmlInput: { maxLength: 500 } }} />
          <Typography sx={muted}>{draft.mode === 'weekly' ? 'All solo workouts and group classes count. Progress resets each Monday.' : draft.mode === 'target' ? 'Your current result is the distance, weight, or other amount you’ve reached. Update it here anytime; it won’t reset each week.' : 'No numbers needed. Mark your goal as achieved when you’re ready.'} You have one active goal.</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}><Button color="inherit" onClick={onClose}>Cancel</Button><Button type="submit" variant="contained">Save goal</Button></DialogActions>
    </Box>
  </Dialog>;
}
