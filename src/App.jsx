import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { SiteLayout } from './layouts/SiteLayout';
import { REDIRECT_STORAGE_KEY } from './admin/config';

const AdminPage = React.lazy(() =>
    import('./admin/AdminPage').then((module) => ({ default: module.AdminPage }))
);

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const redirect = sessionStorage.getItem(REDIRECT_STORAGE_KEY);
    if (redirect) {
      sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#e56e24'
          },
          secondary: {
            main: '#57e524'
          },
          background: {
            default: darkMode ? '#121212' : '#ffffff',
            paper: darkMode ? '#1e1e1e' : '#f8fafc'
          },
        },
        typography: {
          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        },
      }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<SiteLayout isDarkMode={darkMode} toggleTheme={toggleTheme} />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<SiteLayout isDarkMode={darkMode} toggleTheme={toggleTheme} />} />
      </Routes>
    </ThemeProvider>
  );
}
