import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Alert, Avatar, BottomNavigation, BottomNavigationAction, Box, Button, Chip, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, MenuItem, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { AddRounded, ArrowForwardRounded, CheckRounded, DirectionsRunRounded, EmojiEventsOutlined, FitnessCenterRounded, FlagOutlined, GridViewRounded, GroupsOutlined, LocalFireDepartmentOutlined, LockOutlined, SettingsOutlined, TrendingUpRounded } from '@mui/icons-material';
import theme from './theme';
import useFitness from './useFitness';
import { dayKey, stats } from './model';
import { GoalCard, GoalDialog } from './Goal';
const panel = {
  p: {
    xs: 2.5,
    md: 3
  },
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 3px 14px #20242D03',
  borderRadius: '18px'
};
const muted = {
  color: 'text.secondary',
  fontSize: '.78rem'
};
const dateLabel = d => new Date(`${d}T12:00:00`).toLocaleDateString('en-CA', {
  month: 'short',
  day: 'numeric'
});
function Title({
  children,
  action
}) {
  return <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}><Typography variant="h2">{children}</Typography>{action}</Stack>;
}
function Workout({
  w
}) {
  return <Stack direction="row" spacing={1.5} alignItems="center" sx={{
    py: 2,
    borderBottom: '1px solid',
    borderColor: 'divider',
    '&:last-child': {
      borderBottom: 0
    }
  }}><Avatar variant="rounded" sx={{
      bgcolor: w.type === 'class' ? '#F0ECFB' : '#FFF0F1',
      color: w.type === 'class' ? '#7754AD' : 'primary.main',
      width: 44,
      height: 44
    }}>{w.type === 'class' ? <GroupsOutlined /> : <FitnessCenterRounded sx={{
        fontSize: 21
      }} />}</Avatar><Box sx={{
      flex: 1
    }}><Typography sx={{
        fontSize: '.85rem',
        fontWeight: 600
      }}>{w.title}</Typography><Typography sx={{
        ...muted,
        mt: .4
      }}>{w.type === 'class' ? 'Group class' : 'Solo workout'} · {w.duration} min</Typography>{w.location && <Typography sx={{
        ...muted,
        fontSize: '.65rem'
      }}>{w.location}</Typography>}</Box><Box textAlign="right"><Typography sx={{
        fontSize: '.72rem'
      }}>{dateLabel(w.date)}</Typography><Typography sx={{
        fontSize: '.65rem',
        color: 'success.main',
        mt: .5
      }}>Completed ✓</Typography></Box></Stack>;
}
export default function FitnessApp() {
  const [user, setUser] = useState('alex');
  return <ThemeProvider theme={theme}><CssBaseline /><Dashboard key={user} user={user} onUserChange={setUser} /></ThemeProvider>;
}
function Dashboard({
  user,
  onUserChange
}) {
  const {
    workouts,
    goal,
    log,
    setGoal,
    reset,
    storageError
  } = useFitness(user);
  const [view, setView] = useState('overview'),
    [dialog, setDialog] = useState(null),
    [message, setMessage] = useState(''),
    [filter, setFilter] = useState('all');
  const today = dayKey(new Date());
  const freshForm = () => ({
    title: '',
    type: 'solo',
    duration: '0',
    date: today,
    location: ''
  });
  const [form, setForm] = useState(freshForm);
  const p = stats(workouts),
    name = user === 'alex' ? 'Alex' : 'Sam';
  const sorted = [...workouts].reverse().sort((a, b) => b.date.localeCompare(a.date));
  const openLog = () => {
    setForm(freshForm());
    setDialog('workout');
  };
  const openGoal = () => {
    setDialog('goal');
  };
  const navigate = id => id === 'goal' ? openGoal() : setView(id);
  const nav = [['overview', 'Overview', <GridViewRounded />], ['workouts', 'My workouts', <FitnessCenterRounded />], ['goal', 'My goal', <FlagOutlined />]];
  const empty = <Box textAlign="center" py={3}><DirectionsRunRounded sx={{
      color: 'primary.main',
      fontSize: 38
    }} /><Typography sx={{
      fontWeight: 600,
      mt: 1
    }}>Your first workout is a fresh start.</Typography><Typography variant="body2" color="text.secondary" sx={{
      mt: 1,
      mb: 2
    }}>Log any movement you enjoy. Your progress will appear here.</Typography><Button variant="outlined" onClick={openLog} startIcon={<AddRounded />}>Log your first workout</Button></Box>;
  return <Box sx={{
    minHeight: '100vh',
    pb: {
      xs: 10,
      md: 0
    }
  }}>
 <Box component="header" sx={{
      height: 82,
      bgcolor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      px: {
        xs: 2.5,
        md: 5
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2
    }}><Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{
          bgcolor: 'primary.main',
          color: 'white',
          width: 43,
          height: 43,
          borderRadius: '11px 11px 11px 2px',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'Space Grotesk',
          fontWeight: 700,
          fontSize: 31
        }}>Y</Box><Box><Typography sx={{
            fontWeight: 700,
            fontSize: '1.05rem',
            letterSpacing: '-.035em'
          }}>York U <Box component="span" sx={{
              fontWeight: 400
            }}>Fitness</Box></Typography><Typography sx={{
            fontSize: '.58rem',
            letterSpacing: '.16em',
            color: 'text.secondary'
          }}>YOUR CAMPUS. YOUR PACE.</Typography></Box></Stack><Stack component="nav" aria-label="Main navigation" direction="row" spacing={1} sx={{
        display: {
          xs: 'none',
          md: 'flex'
        }
      }}>{nav.map(([id, label, icon]) => <Button key={id} startIcon={icon} onClick={() => navigate(id)} sx={{
          color: view === id ? 'primary.main' : 'text.secondary',
          bgcolor: view === id ? '#FFF0F2' : 'transparent'
        }}>{label}</Button>)}</Stack><Stack direction="row" spacing={1} alignItems="center"><Chip label="DEMO" size="small" sx={{
          display: {
            xs: 'none',
            sm: 'flex'
          },
          fontSize: '.6rem',
          bgcolor: '#F4F5F7'
        }} /><IconButton aria-label="Demo settings" onClick={() => setDialog('settings')}><SettingsOutlined sx={{
            fontSize: 21
          }} /></IconButton><Avatar sx={{
          width: 36,
          height: 36,
          bgcolor: '#F6E8DC',
          color: '#775A42',
          fontSize: '.78rem'
        }} aria-label={`${name} demo profile`}>{name[0]}S</Avatar></Stack></Box>
 <Box component="main" sx={{
      maxWidth: 1160,
      mx: 'auto',
      px: {
        xs: 2.5,
        md: 5
      },
      pt: {
        xs: 3.5,
        md: 5
      },
      pb: 4
    }}>
 {storageError && <Alert severity="info">Browser storage is unavailable. Your progress stays here until you leave the page.</Alert>}
 <Stack direction={{
        xs: 'column',
        sm: 'row'
      }} justifyContent="space-between" alignItems={{
        xs: 'stretch',
        sm: 'center'
      }} gap={2.5} mb={3.5}><Box><Typography sx={{
            ...muted,
            mb: 1,
            fontSize: '.73rem'
          }}>{new Date().toLocaleDateString('en-CA', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</Typography><Typography variant="h1" sx={{
            fontSize: {
              xs: '1.9rem',
              md: '2.3rem'
            }
          }}>{view === 'overview' ? `Your progress, ${name}.` : 'Every workout counts.'}</Typography><Typography sx={{
            color: 'text.secondary',
            mt: 1,
            fontSize: '.86rem'
          }}>{view === 'overview' ? 'A little movement. A little momentum. All yours.' : 'Your solo sessions and group classes, all in one place.'}</Typography></Box><Button variant="contained" startIcon={<AddRounded />} onClick={openLog} sx={{
          alignSelf: {
            xs: 'flex-start',
            sm: 'center'
          },
          px: 2.5
        }}>Log a workout</Button></Stack>
 {view === 'overview' ? <>
 <Paper elevation={0} sx={{
          ...panel,
          mb: 3,
          bgcolor: '#FFF1F2',
          borderColor: '#F8DDE1',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 2.25
        }}><Avatar sx={{
            bgcolor: 'white',
            color: 'primary.main'
          }}><TrendingUpRounded /></Avatar><Box flex={1}><Typography sx={{
              fontSize: '.88rem',
              fontWeight: 600
            }}>{workouts.length ? 'You’re building something good.' : 'Your next chapter starts with one workout.'}</Typography><Typography sx={{
              ...muted,
              mt: .4
            }}>{workouts.length ? 'Every time you show up, you move forward. Keep going at your own pace.' : 'A walk, a class, or time at the gym. It all counts.'}</Typography></Box><Typography sx={{
            display: {
              xs: 'none',
              sm: 'block'
            },
            color: '#D98E99',
            fontSize: 35,
            mr: 1
          }}>↗</Typography></Paper>
 <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1.45fr 1fr'
          },
          gap: 3
        }}>
 <Paper elevation={0} sx={panel}><GoalCard goal={goal} weeklyCount={p.weekly} onEdit={openGoal} onSave={next => { setGoal(next); setMessage(next.completed ? 'Goal achieved. Celebrate your progress!' : 'Your goal is back in progress. Keep moving at your pace.'); }} /></Paper>
 <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2
          }}>{[['Current streak', p.streak, p.streak === 1 ? 'day in a row' : 'days in a row', <LocalFireDepartmentOutlined />, '#FFF5EA', '#B56C22'], ['Total workouts', p.total, 'since you started', <FitnessCenterRounded />, '#EEF3FC', '#5578B5']].map(([label, value, caption, icon, bg, color]) => <Paper key={label} elevation={0} sx={{
              ...panel,
              p: 2.5
            }}><Avatar variant="rounded" sx={{
                bgcolor: bg,
                color,
                mb: 2.5,
                width: 40,
                height: 40
              }}>{icon}</Avatar><Typography sx={{
                ...muted,
                fontSize: '.73rem'
              }}>{label}</Typography><Typography variant="h3" sx={{
                mt: 1,
                fontSize: '2.7rem'
              }}>{value}</Typography><Typography sx={{
                ...muted,
                fontSize: '.68rem'
              }}>{caption}</Typography><Typography sx={{
                ...muted,
                mt: 2,
                fontSize: '.68rem'
              }}>{label === 'Current streak' ? 'One active day at a time.' : 'Time well spent on you.'}</Typography></Paper>)}</Box>
 <Paper elevation={0} sx={panel}><Title action={<Chip label={`${p.weekly} ${p.weekly === 1 ? 'workout' : 'workouts'}`} size="small" sx={{
              bgcolor: '#F4F5F7',
              fontSize: '.66rem'
            }} />}>This week</Title><Typography sx={{
              ...muted,
              mt: -1.5
            }}>{dateLabel(dayKey(p.days[0]))} – {dateLabel(dayKey(p.days[6]))}</Typography><Stack direction="row" justifyContent="space-between" spacing={1} sx={{
              mt: 3.5,
              mb: 2.5
            }}>{p.days.map((day, i) => {
                const count = p.counts[i],
                  current = dayKey(day) === today;
                return <Box key={i} sx={{
                  flex: 1,
                  textAlign: 'center'
                }}><Typography sx={{
                    fontSize: '.65rem',
                    color: current ? 'primary.main' : 'text.secondary',
                    fontWeight: current ? 700 : 400
                  }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Typography><Box aria-label={`${day.toLocaleDateString('en-CA', {
                    weekday: 'long'
                  })}: ${count} workouts${current ? ', today' : ''}`} sx={{
                    mx: 'auto',
                    my: 1.3,
                    width: {
                      xs: 30,
                      sm: 38
                    },
                    height: {
                      xs: 30,
                      sm: 38
                    },
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: count ? 'primary.main' : '#F4F5F7',
                    color: count ? 'white' : '#B5BAC3',
                    border: current ? '2px solid' : '2px solid transparent',
                    borderColor: current ? 'primary.main' : 'transparent',
                    outline: current ? '3px solid #FCE1E5' : 'none'
                  }}>{count ? count > 1 ? count : <CheckRounded sx={{
                      fontSize: 17
                    }} /> : '·'}</Box><Typography sx={{
                    fontSize: '.65rem',
                    color: current ? 'primary.main' : 'text.secondary'
                  }}>{day.getDate()}</Typography></Box>;
              })}</Stack><Divider sx={{
              mb: 2
            }} /><Stack direction="row" justifyContent="space-between"><Typography sx={{
                ...muted,
                fontSize: '.7rem'
              }}><Box component="span" sx={{
                  color: 'primary.main',
                  mr: .7
                }}>●</Box>Workout completed</Typography><Typography sx={{
                ...muted,
                fontSize: '.7rem'
              }}>Small steps add up.</Typography></Stack></Paper>
 <Paper elevation={0} sx={panel}><Title action={workouts.length ? <Button size="small" onClick={() => setView('workouts')} sx={{
              fontSize: '.72rem'
            }}>View all <ArrowForwardRounded sx={{
                fontSize: 15,
                ml: .7
              }} /></Button> : null}>Recent workouts</Title>{sorted.length ? sorted.slice(0, 3).map(w => <Workout key={w.id} w={w} />) : empty}</Paper></Box>
 <Paper elevation={0} sx={{
          ...panel,
          mt: 3,
          py: 2.5,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          bgcolor: '#F0F4EF',
          borderColor: '#E2E9DF'
        }}><EmojiEventsOutlined sx={{
            color: '#637D56',
            fontSize: 29
          }} /><Box><Typography sx={{
              fontWeight: 600,
              fontSize: '.85rem'
            }}>Progress looks different for everyone.</Typography><Typography sx={{
              ...muted,
              mt: .4
            }}>A 15-minute walk or a full class. Showing up for yourself is what matters.</Typography></Box></Paper>
 </> : <Paper elevation={0} sx={panel}><Title action={<Typography sx={muted}>{workouts.length} total</Typography>}>My workouts</Title><Stack direction="row" spacing={1} mb={1}>{[['all', 'All workouts'], ['solo', 'Solo'], ['class', 'Group classes']].map(([id, label]) => <Chip key={id} label={label} onClick={() => setFilter(id)} variant={filter === id ? 'filled' : 'outlined'} color={filter === id ? 'primary' : 'default'} />)}</Stack>{!sorted.length ? empty : sorted.filter(w => filter === 'all' || w.type === filter).length ? sorted.filter(w => filter === 'all' || w.type === filter).map(w => <Workout key={w.id} w={w} />) : <Typography sx={{
          py: 5,
          textAlign: 'center',
          color: 'text.secondary'
        }}>No {filter === 'class' ? 'group classes' : 'solo workouts'} yet. Your next one will appear here.</Typography>}</Paper>}
 <Stack component="footer" direction={{
        xs: 'column',
        sm: 'row'
      }} gap={1} justifyContent="space-between" sx={{
        mt: 3.5,
        color: 'text.secondary'
      }}><Typography sx={{
          fontSize: '.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: .6
        }}><LockOutlined sx={{
            fontSize: 13
          }} />Frontend demo · Saved in this browser only</Typography><Typography sx={{
          fontSize: '.65rem'
        }}>York U Fitness · Move at your own pace.</Typography></Stack></Box>
 <BottomNavigation showLabels value={view} onChange={(_, v) => navigate(v)} sx={{
      display: {
        xs: 'flex',
        md: 'none'
      },
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(66px + env(safe-area-inset-bottom))',
      pb: 'env(safe-area-inset-bottom)',
      borderTop: '1px solid',
      borderColor: 'divider',
      zIndex: 10,
      '& .MuiBottomNavigationAction-label': {
        fontSize: '.65rem !important',
        mt: .5
      }
    }}>{nav.map(([id, label, icon]) => <BottomNavigationAction key={id} value={id} label={label} icon={icon} />)}</BottomNavigation>
 <Dialog open={dialog === 'workout'} onClose={() => setDialog(null)} fullWidth maxWidth="xs"><Box component="form" onSubmit={e => {
        e.preventDefault();
        if (!form.title.trim() || !form.date || form.date > today || !Number.isInteger(Number(form.duration)) || Number(form.duration) < 1 || Number(form.duration) > 600) return;
        log({
          ...form,
          title: form.title.trim(),
          duration: Number(form.duration)
        });
        setDialog(null);
        setMessage('Workout logged. A little more momentum for you!');
      }}><DialogTitle>Log a workout</DialogTitle><DialogContent><Typography variant="body2" color="text.secondary" sx={{
            mb: 3
          }}>Big or small, your movement deserves a moment.</Typography><Stack spacing={2.5}><TextField autoFocus required label="Workout name" placeholder="e.g. Campus walk" value={form.title} onChange={e => setForm({
              ...form,
              title: e.target.value
            })} slotProps={{
              htmlInput: {
                maxLength: 80
              }
            }} /><TextField select label="Workout type" value={form.type} onChange={e => setForm({
              ...form,
              type: e.target.value
            })}><MenuItem value="solo">Solo workout</MenuItem><MenuItem value="class">Group class</MenuItem></TextField><Stack direction="row" spacing={2}><TextField required label="Duration (minutes)" type="number" value={form.duration} onChange={e => setForm({
                ...form,
                duration: e.target.value
              })} slotProps={{
                htmlInput: {
                  min: 1,
                  max: 600,
                  step: 1
                }
              }} /><TextField required label="Date" type="date" value={form.date} onChange={e => setForm({
                ...form,
                date: e.target.value
              })} slotProps={{
                inputLabel: {
                  shrink: true
                },
                htmlInput: {
                  max: today
                }
              }} /></Stack><TextField label="Location (optional)" value={form.location} onChange={e => setForm({
              ...form,
              location: e.target.value
            })} slotProps={{
              htmlInput: {
                maxLength: 100
              }
            }} /><Typography sx={muted}>Already moved today? You can log as many workouts as you like.</Typography></Stack></DialogContent><DialogActions sx={{
          p: 3,
          pt: 1
        }}><Button color="inherit" onClick={() => setDialog(null)}>Cancel</Button><Button type="submit" variant="contained">Save workout</Button></DialogActions></Box></Dialog>
 {dialog === 'goal' && <GoalDialog goal={goal} onClose={() => setDialog(null)} onSave={next => { setGoal(next); setDialog(null); setMessage('Your goal is saved. Make it work for you.'); }} />}
 <Dialog open={dialog === 'settings'} onClose={() => setDialog(null)} fullWidth maxWidth="xs"><DialogTitle>Demo settings</DialogTitle><DialogContent><Typography variant="body2" color="text.secondary" sx={{
          mb: 3
        }}>This frontend prototype uses simulated profiles. Data stays in this browser; profiles are not authenticated accounts. Use fictional workout data on shared devices.</Typography><TextField select fullWidth label="Demo profile" value={user} onChange={e => onUserChange(e.target.value)}><MenuItem value="alex">Alex</MenuItem><MenuItem value="sam">Sam</MenuItem></TextField><Typography variant="body2" sx={{
          mt: 2
        }}>Each profile starts at zero with no goal or workouts. Progress is based on your own logged activity.</Typography><Typography sx={{
          ...muted,
          mt: 2
        }}>Streaks count consecutive days with at least one workout, remaining active today if you worked out yesterday.</Typography><Button color="inherit" variant="outlined" sx={{ mt: 3 }} onClick={() => setDialog('reset')}>Reset this demo profile</Button></DialogContent><DialogActions><Button onClick={() => setDialog(null)}>Done</Button></DialogActions></Dialog>
 <Dialog open={dialog === 'reset'} onClose={() => setDialog(null)} fullWidth maxWidth="xs"><DialogTitle>Start this demo profile over?</DialogTitle><DialogContent><Typography variant="body2">This clears this profile’s goal and logged workouts from this browser and resets all progress to zero.</Typography></DialogContent><DialogActions><Button onClick={() => setDialog('settings')}>Cancel</Button><Button color="error" onClick={() => { reset(); setDialog(null); setMessage('Demo profile reset. Ready for your first workout.'); }}>Reset profile</Button></DialogActions></Dialog>
 <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage('')} anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }} sx={{
      bottom: {
        xs: '85px !important',
        md: '24px !important'
      }
    }}><Alert severity="success" variant="filled" onClose={() => setMessage('')} sx={{
        borderRadius: 3
      }}>{message}</Alert></Snackbar>
 </Box>;
}
