import ReactGA from 'react-ga4';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useWindowSize } from 'react-use';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider } from 'styled-components';
import { StyleSheetManager } from 'styled-components';
import rtlPlugin from 'stylis-plugin-rtl';

import ThemeStyles from '@styles/theme';
import './style.scss';

import { SidebarProvider } from '@contexts/sidebarContext';
import { useThemeProvider } from '@contexts/themeContext';
import useAuthRoute from '@hooks/useAuthRoute';
import { preventDefault } from '@utils/helpers';

import PrivateRoute from "./network/privateRoute";

import LoadingScreen from '@components/LoadingScreen';
import Sidebar from '@layout/Sidebar';
import BottomNav from '@layout/BottomNav';
import Navbar from '@layout/Navbar';
import ShoppingCart from '@widgets/ShoppingCart';
import ScrollToTop from '@components/ScrollToTop';
import Blank from "@pages/Blank";
import Dashboard from "@pages/Dashboard";
import Kader from "@pages/Kader";
import SpielerDetail from "@pages/SpielerDetail";
import AddPlayerPage from "@pages/AddPlayer";
import SetTrainerPage from "@pages/SetTrainerPage";
import UpdateTeamPage from "@pages/UpdateTeam";
import Vertrag from "@pages/Vertrag";
import Finanzen from "@pages/Finanzen";
import MatchesOverview from "@pages/MatchesOverview";
import MatchDetailPage from "@pages/MatchDetailPage";

// Lazy-loaded pages
const ClubSummary = lazy(() => import('@pages/ClubSummary'));
const GameSummary = lazy(() => import('@pages/GameSummary'));
const Championships = lazy(() => import('@pages/Championships'));
const LeagueOverview = lazy(() => import('@pages/LeagueOverview'));
const FansCommunity = lazy(() => import('@pages/FansCommunity'));
const Statistics = lazy(() => import('@pages/Statistics'));
const PageNotFound = lazy(() => import('@pages/PageNotFound'));
const MatchSummary = lazy(() => import('@pages/MatchSummary'));
const MatchOverview = lazy(() => import('@pages/MatchOverview'));
const PlayerProfile = lazy(() => import('@pages/PlayerProfile'));
const Schedule = lazy(() => import('@pages/Schedule'));
const Tickets = lazy(() => import('@pages/Tickets'));
const FootballStore = lazy(() => import('@pages/FootballStore'));
const BrandStore = lazy(() => import('@pages/BrandStore'));
const Product = lazy(() => import('@pages/Product'));
const Login = lazy(() => import('@pages/Login'));
const SignUp = lazy(() => import('@pages/SignUp'));
const Settings = lazy(() => import('@pages/Settings'));

const App = () => {
    const appRef = useRef(null);
    const { theme, direction } = useThemeProvider();
    const { width } = useWindowSize();
    const isAuthRoute = useAuthRoute();

    // Google Analytics init
    const gaKey = process.env.REACT_APP_PUBLIC_GA;
    if (gaKey) {
        ReactGA.initialize(gaKey);
    }

    // auto RTL support for Material-UI components and styled-components
    const plugins = direction === 'rtl' ? [rtlPlugin] : [];

    const muiTheme = createTheme({
        direction: direction,
    });

    const cacheRtl = createCache({
        key: 'css-rtl',
        stylisPlugins: plugins,
    });

    useEffect(() => {
        // scroll to top on route change
        if (appRef.current) {
            appRef.current.scrollTo(0, 0);
        }
        preventDefault();
    }, []);

    return (
        <CacheProvider value={cacheRtl}>
            <MuiThemeProvider theme={muiTheme}>
                <SidebarProvider>
                    <ThemeProvider theme={{ theme: theme }}>
                        <ThemeStyles />
                        <ToastContainer theme={theme} autoClose={2500} position={direction === 'ltr' ? 'top-right' : 'top-left'} />
                        <StyleSheetManager stylisPlugins={plugins}>
                            <div className={`app ${isAuthRoute ? 'fluid' : ''}`} ref={appRef}>
                                <ScrollToTop />
                                {!isAuthRoute && (
                                    <>
                                        <Sidebar />
                                        {width < 768 && <Navbar />}
                                        {/*{width < 768 && <BottomNav />}*/}
                                    </>
                                )}
                                <div className="app_container">
                                    <div className="app_container-content d-flex flex-column flex-1">
                                        <Suspense fallback={<LoadingScreen />}>
                                            <Routes>
                                                {/* Public Routes */}
                                                <Route path="/login" element={<Login />} />
                                                <Route path="/sign-up" element={<SignUp />} />
                                                <Route path="*" element={<PrivateRoute><PageNotFound /></PrivateRoute>} />
                                                {/* Protected Routes */}
                                                <Route path="/" element={<PrivateRoute><Kader /></PrivateRoute>} />
                                                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                                <Route path="/blank" element={<PrivateRoute><Blank /></PrivateRoute>} />
                                                <Route path="/matches" element={<PrivateRoute><MatchesOverview /></PrivateRoute>} />
                                                <Route path="/office/finanzen" element={<PrivateRoute><Finanzen /></PrivateRoute>} />
                                                <Route path="/matches/:id" element={<PrivateRoute><MatchDetailPage /></PrivateRoute>} />


                                                <Route path="/game-summary" element={<PrivateRoute><GameSummary /></PrivateRoute>} />
                                                <Route path="/club-summary" element={<PrivateRoute><ClubSummary /></PrivateRoute>} />
                                                <Route path="/championships" element={<PrivateRoute><Championships /></PrivateRoute>} />
                                                <Route path="/league-overview" element={<PrivateRoute><LeagueOverview /></PrivateRoute>} />
                                                <Route path="/fans-community" element={<PrivateRoute><FansCommunity /></PrivateRoute>} />
                                                <Route path="/statistics" element={<PrivateRoute><Statistics /></PrivateRoute>} />
                                                <Route path="/match-summary" element={<PrivateRoute><MatchSummary /></PrivateRoute>} />
                                                <Route path="/match-overview" element={<PrivateRoute><MatchOverview /></PrivateRoute>} />
                                                <Route path="/player-profile" element={<PrivateRoute><PlayerProfile /></PrivateRoute>} />
                                                <Route path="/schedule" element={<PrivateRoute><Schedule /></PrivateRoute>} />
                                                <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />
                                                <Route path="/football-store" element={<PrivateRoute><FootballStore /></PrivateRoute>} />
                                                <Route path="/brand-store" element={<PrivateRoute><BrandStore /></PrivateRoute>} />
                                                <Route path="/product" element={<PrivateRoute><Product /></PrivateRoute>} />
                                                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                                            </Routes>
                                        </Suspense>
                                    </div>
                                </div>
                                <ShoppingCart isPopup />
                            </div>
                        </StyleSheetManager>
                    </ThemeProvider>
                </SidebarProvider>
            </MuiThemeProvider>
        </CacheProvider>
    );
}

export default App;
