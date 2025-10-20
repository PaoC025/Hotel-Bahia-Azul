import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E40AF", // azul profundo
      light: "#3B82F6", // azul más claro
      dark: "#1E3A8A",
    },
    secondary: {
      main: "#FBBF24", // amarillo dorado (acento)
      light: "#FCD34D",
      dark: "#F59E0B",
    },
    background: {
      default: "#F9FAFB", // gris muy claro
      paper: "#FFFFFF", // fondos de tarjetas
    },
    text: {
      primary: "#1F2937", // gris oscuro
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h1: { 
      fontWeight: 800, 
      fontSize: "2.5rem",
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
    },
    h2: { 
      fontWeight: 700, 
      fontSize: "2rem",
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: { 
      fontWeight: 600,
      fontSize: "1.75rem",
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: { 
      textTransform: "none", 
      fontWeight: 600,
      borderRadius: '12px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 22px",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        },
      },
    },
  },
});

export default theme;