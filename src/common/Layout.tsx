import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Link from '@mui/material/Link'
const theme = createTheme();

export default function Layout(): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            読書管理アプリ
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
       <Typography variant="h6" align="center" gutterBottom>
       <Link href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener" underline="hover" sx={{ mx: 2 }}>
        Footer1
       </Link>
       <Link href="https://ja.react.dev/" target="_blank" rel="noopener" underline="hover" sx={{ mx: 2 }}>
        Footer2
       </Link>

       <Link href="https://nextjs.org/docs" target="_blank" rel="noopener" underline="hover" sx={{ mx: 2 }}>
        Footer3
       </Link>
       </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Copyright ©
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}
