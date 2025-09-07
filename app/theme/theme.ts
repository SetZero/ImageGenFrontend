import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  palette: {
    mode: 'light',
    background: {
      default: '#f5f7fa', // body background light
      paper: '#e1e8ed', // container background light
    },
    text: {
      primary: '#4a4a4a', // body text light
      secondary: '#2f3e46', // h1 text
    },
    primary: {
      main: '#718096', // button background color light
      contrastText: '#fff',
    },
    secondary: {
      main: '#4a5568', // button hover color light
    },
    divider: '#bfcad6', // textarea border light
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#e1e8ed',
          padding: '2.5rem 3rem',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          maxWidth: 480,
          width: '90%',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontWeight: 700,
          fontSize: '2rem',
          color: '#2f3e46',
          marginBottom: '1.5rem',
          transition: 'color 0.3s ease',
        },
      },
    },
    MuiTextareaAutosize: {
      styleOverrides: {
        root: {
          width: '100%',
          height: 90,
          padding: '0.7rem',
          fontSize: '1rem',
          fontFamily: 'inherit',
          border: '1px solid #bfcad6',
          borderRadius: 8,
          resize: 'vertical' as const,
          marginBottom: '1.5rem',
          backgroundColor: '#f5f7fa',
          transition: 'border-color 0.3s ease',
          '&:focus': {
            outline: 'none',
            borderColor: '#718096',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#718096',
          color: '#fff',
          fontWeight: 600,
          padding: '0.8rem 2rem',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: '1rem',
          boxShadow: '0 4px 12px rgba(113, 128, 150, 0.4)',
          marginBottom: '1.6rem',
          marginTop: '0.5rem',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            backgroundColor: '#4a5568',
            boxShadow: '0 6px 20px rgba(74, 85, 104, 0.6)',
          },
        },
      },
    },
  },
};

const theme = createTheme(baseThemeOptions);

const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: 'dark',
    background: {
      default: '#121619',
      paper: '#1c1f26',
    },
    text: {
      primary: '#cfd8dc',
      secondary: '#e0e6e9',
    },
    primary: {
      main: '#597faaff',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2c3746',
    },
    divider: '#23272e',
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#1c1f26',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
          padding: '2.5rem 3rem',
          borderRadius: 16,
          maxWidth: 480,
          width: '90%',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: '#e0e6e9',
          fontWeight: 700,
          fontSize: '2rem',
          marginBottom: '1.5rem',
          transition: 'color 0.3s ease',
        },
      },
    },
    MuiTextareaAutosize: {
      styleOverrides: {
        root: {
          backgroundColor: '#181d21',
          color: '#e0e6e9',
          borderColor: '#23272e',
          borderRadius: 8,
          padding: '0.7rem',
          width: '100%',
          height: 90,
          fontSize: '1rem',
          fontFamily: 'inherit',
          marginBottom: '1.5rem',
          resize: 'vertical' as const,
          transition: 'border-color 0.3s ease',
          '&:focus': {
            outline: 'none',
            borderColor: '#718096',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#3a4756',
          color: '#fff',
          fontWeight: 600,
          padding: '0.8rem 2rem',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '1.6rem',
          marginTop: '0.5rem',
          boxShadow: '0 4px 12px rgba(58, 71, 86, 0.7)',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            backgroundColor: '#2c3746',
            boxShadow: '0 6px 20px rgba(44, 55, 70, 0.85)',
          },
        },
      },
    },
  },
});

export { theme, darkTheme };