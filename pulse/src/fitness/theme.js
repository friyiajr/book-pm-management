import { createTheme } from '@mui/material/styles';
import brand from '../brand';
export default createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.accent,
      dark: '#B7102B'
    },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#20242D',
      secondary: '#69717F'
    },
    divider: '#E9EBEF',
    success: {
      main: '#247354'
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '2.3rem',
      fontWeight: 700,
      letterSpacing: '-.055em'
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '1.15rem',
      fontWeight: 700,
      letterSpacing: '-.025em'
    },
    h3: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-.04em'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: 0
    },
    body2: {
      fontSize: '.82rem',
      lineHeight: 1.65
    }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#F7F8FA',
          backgroundImage: 'none'
        },
        '*': {
          boxSizing: 'border-box'
        },
        '::selection': {
          background: '#FCE1E5'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 18px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20
        }
      }
    }
  }
});
