// src/theme.js
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6a1b9a', // Cyan (you can change this)
    },
    secondary: {
      main: '#ff4081', // Vibrant pink (or your choice)
    },
    background: {
      default: '#121212',      // Page background
      paper: '#1a1a1a',        // Paper components like Card, Table, AppBar, etc.
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a1a1a', // Ensure Paper is darker and solid
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#6a1b9a', // Darker AppBar
        },
      },
    },
  },
});

export default darkTheme;

