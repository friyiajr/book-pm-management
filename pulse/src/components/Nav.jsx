import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PulseLine from './PulseLine';
import NavShader from './NavShader';
import { tokens } from '../theme';
import brand from '../brand';

/**
 * App header with PulseLine logo and responsive navigation.
 * Mobile (≤600px): BottomNavigation fixed to bottom.
 * Desktop: Tabs in the header.
 */
export default function Nav({ view, onChangeView, showProgress = false }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const newProgressSx = {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    color: tokens.newFeature,
    bgcolor: tokens.newFeatureBackground,
    border: `1px solid ${tokens.newFeature}`,
    borderRadius: '8px',
    fontWeight: 700,
    textShadow: '0 1px 3px #000, 0 0 8px #000',
    animation: prefersReducedMotion ? 'none' : 'newProgressGlow 1.6s ease-in-out 3',
    '@keyframes newProgressGlow': {
      '0%, 100%': { boxShadow: `inset 0 0 0 0 ${tokens.newFeatureGlow}` },
      '50%': { boxShadow: `inset 0 0 20px 3px ${tokens.newFeatureGlow}` },
    },
    '&.Mui-selected': { color: tokens.newFeature, bgcolor: tokens.newFeatureBackground },
    '&:hover': { bgcolor: tokens.newFeatureBackground, boxShadow: `inset 0 0 12px ${tokens.newFeatureGlow}` },
    '&.Mui-focusVisible': { outline: '2px solid white', outlineOffset: '-3px' },
    '& .MuiBottomNavigationAction-label': { fontWeight: 700 },
  };

  return (
    <>
      {/* App header */}
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderBottom: `1px solid ${tokens.borderViolet}`,
          backgroundColor: 'rgba(20,20,28,0.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          ...(showProgress && { flexWrap: 'wrap', gap: 1, pr: { xs: 7, sm: 8 } }),
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PulseLine width={120} height={28} animate={!prefersReducedMotion} />
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              fontWeight: 700,
              background: `linear-gradient(135deg, ${tokens.violet} 0%, ${tokens.violetBright} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {brand.name}
          </Typography>
        </Box>

        {/* Desktop tabs */}
        {!isMobile && (
          <Tabs
            value={view}
            onChange={(_, v) => onChangeView(v)}
            aria-label="Main navigation"
            variant={showProgress ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            sx={showProgress ? { maxWidth: '100%' } : undefined}
          >
            {showProgress && <Tab icon={<TrendingUpIcon />} iconPosition="start" label={<><NavShader reducedMotion={prefersReducedMotion} /><span>(NEW) Progress</span></>} value={4} id="nav-progress" sx={newProgressSx} />}
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Dashboard" value={0} id="nav-dashboard" />
            <Tab icon={<AddCircleOutlineIcon />} iconPosition="start" label="Log" value={1} id="nav-log" />
            <Tab icon={<HistoryIcon />} iconPosition="start" label="History" value={2} id="nav-history" />
            <Tab icon={<InsightsIcon />} iconPosition="start" label="Summary" value={3} id="nav-summary" />
          </Tabs>
        )}
      </Box>

      {/* Mobile bottom navigation */}
      {isMobile && (
        <BottomNavigation
          value={view}
          onChange={(_, v) => onChangeView(v)}
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            ...(showProgress && {
              '& .MuiBottomNavigationAction-root': { minWidth: 0, px: 0.5 },
              '& .MuiBottomNavigationAction-label': { fontSize: '0.65rem', '&.Mui-selected': { fontSize: '0.7rem' } },
            }),
          }}
        >
          {showProgress && <BottomNavigationAction label={<><NavShader reducedMotion={prefersReducedMotion} /><span>(NEW) Progress</span></>} value={4} icon={<TrendingUpIcon />} id="nav-mobile-progress" sx={newProgressSx} />}
          <BottomNavigationAction label="Dashboard" value={0} icon={<DashboardIcon />} id="nav-mobile-dashboard" />
          <BottomNavigationAction label="Log" value={1} icon={<AddCircleOutlineIcon />} id="nav-mobile-log" />
          <BottomNavigationAction label="History" value={2} icon={<HistoryIcon />} id="nav-mobile-history" />
          <BottomNavigationAction label="Summary" value={3} icon={<InsightsIcon />} id="nav-mobile-summary" />
        </BottomNavigation>
      )}
    </>
  );
}
