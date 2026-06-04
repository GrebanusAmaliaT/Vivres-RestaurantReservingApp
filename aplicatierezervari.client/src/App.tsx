import * as React from 'react';
import { useState, useEffect } from 'react';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/Auth/AuthPage';

import { ManagerProfileSetup } from './pages/manager/tsx/ManagerProfileSetup';
import { ManagerDashboard } from './pages/manager/tsx/ManagerDashboard';
import { ManagerEventManagementPage } from './pages/manager/tsx/ManagerEventManagementPage';

import { RestaurantListingPage } from './pages/client/tsx/RestaurantListingPage';
import { ReservationPage } from './pages/client/tsx/ReservationPage';
import { EventRestaurantListingPage } from './pages/client/tsx/EventRestaurantListingPage';
import { EventRestaurantDetailsPage } from './pages/client/tsx/EventRestaurantDetailsPage';
import { EventReservationPage } from './pages/client/tsx/EventReservationPage';
import { MyReservationsPage } from './pages/client/tsx/MyReservationsPage';
import { MyReviewsPage } from './pages/client/tsx/MyReviewsPage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

import type {
    RestaurantDto,
    EventRestaurantListingDto
} from './types/index';

type AppView =
    | 'Landing'
    | 'Auth'
    | 'ManagerSetup'
    | 'ManagerDashboard'
    | 'ManagerEvents'
    | 'RestaurantListing'
    | 'Reservation'
    | 'EventRestaurantListing'
    | 'EventRestaurantDetails'
    | 'EventReservation'
    | 'AccountDetails'
    | 'MyReservations'
    | 'MyReviews'
    | 'AdminDashboard';

export default function App() {
    const [role, setRole] = useState<string | null>(() =>
        localStorage.getItem('vivres_role')
    );

    const [hasProfile, setHasProfile] = useState<boolean>(() =>
        localStorage.getItem('vivres_has_profile') === 'true'
    );

    const [currentView, setCurrentView] = useState<AppView>('Landing');

    const [selectedRestaurant, setSelectedRestaurant] =
        useState<RestaurantDto | null>(null);

    const [selectedEventRestaurant, setSelectedEventRestaurant] =
        useState<EventRestaurantListingDto | null>(null);

    const token = localStorage.getItem('vivres_token');

    const isAuthenticated = Boolean(token && role);

    const normalizedRole = role?.toLowerCase() ?? '';

    const requireAuth = (targetView: AppView) => {
        if (!isAuthenticated) {
            setCurrentView('Auth');
            return;
        }

        setCurrentView(targetView);
    };

    const requireRole = (targetView: AppView, allowedRoles: string[]) => {
        if (!isAuthenticated) {
            setCurrentView('Auth');
            return;
        }

        const hasRole = allowedRoles
            .map(roleName => roleName.toLowerCase())
            .includes(normalizedRole);

        if (!hasRole) {
            setCurrentView('Landing');
            return;
        }

        setCurrentView(targetView);
    };

    useEffect(() => {
        const publicViews: AppView[] = ['Landing', 'Auth'];

        if (!isAuthenticated && !publicViews.includes(currentView)) {
            setCurrentView('Auth');
        }
    }, [isAuthenticated, currentView]);

    useEffect(() => {
        if (!role) {
            return;
        }

        if (normalizedRole === 'admin') {
            setCurrentView('AdminDashboard');
            return;
        }

        if (normalizedRole === 'restaurantmanager' ) {
            setCurrentView(hasProfile ? 'ManagerDashboard' : 'ManagerSetup');
        }
    }, [role, normalizedRole, hasProfile]);

    const handleNavigation = (view: 'Book a table' | 'Plan your event') => {
        if (!isAuthenticated) {
            setCurrentView('Auth');
            return;
        }

        if (view === 'Book a table') {
            setCurrentView('RestaurantListing');
            return;
        }

        setCurrentView('EventRestaurantListing');
    };
    const handleAuthSuccess = (
        userRole: string,
        profileCompletedBackend?: boolean
    ) => {
        setRole(userRole);
        localStorage.setItem('vivres_role', userRole);

        const normalizedRole = userRole.toLowerCase();

        const isProfileComplete =
            profileCompletedBackend === true ||
            normalizedRole === 'admin';

        localStorage.setItem('vivres_has_profile', String(isProfileComplete));
        setHasProfile(isProfileComplete);

        if (normalizedRole === 'admin') {
            setCurrentView('AdminDashboard');
            return;
        }

        if (normalizedRole === 'restaurantmanager' || normalizedRole === 'manager') {
            setCurrentView(isProfileComplete ? 'ManagerDashboard' : 'ManagerSetup');
            return;
        }

        setCurrentView('Landing');
    };

    const handleProfileSaveSuccess = () => {
        localStorage.setItem('vivres_has_profile', 'true');
        setHasProfile(true);
        setCurrentView('ManagerDashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('vivres_role');
        localStorage.removeItem('vivres_has_profile');
        localStorage.removeItem('vivres_token');
        localStorage.removeItem('vivres_city');
        localStorage.removeItem('vivres_city_id');

        setRole(null);
        setHasProfile(false);
        setSelectedRestaurant(null);
        setSelectedEventRestaurant(null);
        setCurrentView('Landing');
    };

    const isUserAManager =
        role?.toLowerCase() === 'manager' ||
        role?.toLowerCase() === 'restaurantmanager';

    const isUserAdmin =
        role?.toLowerCase() === 'admin';

    return (
        <div className="w-100 min-vh-screen" style={{ backgroundColor: '#ffffff' }}>
            {currentView === 'Auth' && (
                <AuthPage
                    onAuthSuccess={(rolePayload, hasProfileCompleted) =>
                        handleAuthSuccess(rolePayload, hasProfileCompleted)
                    }
                    onBack={() => setCurrentView('Landing')}
                />
            )}

            {currentView === 'Landing' && (
                <LandingPage
                    onNavigate={handleNavigation}
                    onAccountClick={() => {
                        if (!isAuthenticated) {
                            setCurrentView('Auth');
                            return;
                        }

                        if (isUserAdmin) {
                            setCurrentView('AdminDashboard');
                            return;
                        }

                        if (isUserAManager) {
                            setCurrentView(hasProfile ? 'ManagerDashboard' : 'ManagerSetup');
                            return;
                        }

                        if (normalizedRole === 'client') {
                            setCurrentView('MyReservations');
                            return;
                        }

                        setCurrentView('Landing');
                    }}
                    userRole={role ?? 'Guest'}
                    onLogout={handleLogout}
                />
            )}

            {currentView === 'ManagerSetup' && (
                <ManagerProfileSetup
                    onSaveSuccess={handleProfileSaveSuccess}
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={hasProfile ? () => setCurrentView('ManagerDashboard') : undefined}
                />
            )}

            {currentView === 'ManagerDashboard' && (
                <ManagerDashboard
                    restaurantName="Restaurantul Tau Vivres"
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('Landing')}
                    onEditProfileClick={() => setCurrentView('ManagerSetup')}
                    onManageEventsClick={() => setCurrentView('ManagerEvents')}
                />
            )}

            {currentView === 'ManagerEvents' && (
                <ManagerEventManagementPage
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('ManagerDashboard')}
                />
            )}

            {currentView === 'RestaurantListing' && (
                <RestaurantListingPage
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('Landing')}
                    onSelectRestaurant={(restaurant) => {
                        setSelectedRestaurant(restaurant);
                        requireAuth('Reservation');
                    }}
                    onAccountDetailsClick={() => alert('Pagina Detalii cont urmeaza.')}
                    onMyReservationsClick={() => requireRole('MyReservations', ['Client'])}
                    onMyReviewsClick={() => requireRole('MyReviews', ['Client'])}
                />
            )}

            {currentView === 'Reservation' && (
                <ReservationPage
                    restaurant={selectedRestaurant}
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('RestaurantListing')}
                    onReservationSent={() => setCurrentView('RestaurantListing')}
                    onAccountDetailsClick={() => alert('Pagina Detalii cont urmeaza.')}
                    onMyReservationsClick={() => requireRole('MyReservations', ['Client'])}
                    onMyReviewsClick={() => requireRole('MyReviews', ['Client'])}
                />
            )}

            {currentView === 'EventRestaurantListing' && (
                <EventRestaurantListingPage
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('Landing')}
                    onSelectRestaurant={(restaurant) => {
                        setSelectedEventRestaurant(restaurant);
                        setCurrentView('EventRestaurantDetails');
                    }}
                    onAccountDetailsClick={() => alert('Pagina Detalii cont urmeaza.')}
                    onMyReservationsClick={() => requireRole('MyReservations', ['Client'])}
                    onMyReviewsClick={() => requireRole('MyReviews', ['Client'])}
                />
            )}

            {currentView === 'EventRestaurantDetails' && (
                <EventRestaurantDetailsPage
                    restaurant={selectedEventRestaurant}
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('EventRestaurantListing')}
                    onStartEventRequest={(restaurant) => {
                        setSelectedEventRestaurant(restaurant);
                        setCurrentView('EventReservation');
                    }}
                    onAccountDetailsClick={() => alert('Pagina Detalii cont urmeaza.')}
                    onMyReservationsClick={() => requireRole('MyReservations', ['Client'])}
                    onMyReviewsClick={() => requireRole('MyReviews', ['Client'])}
                />
            )}

            {currentView === 'EventReservation' && (
                <EventReservationPage
                    restaurant={selectedEventRestaurant}
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('EventRestaurantDetails')}
                    onRequestSent={() => setCurrentView('EventRestaurantListing')}
                    onAccountDetailsClick={() => alert('Pagina Detalii cont urmeaza.')}
                    onMyReservationsClick={() => requireRole('MyReservations', ['Client'])}
                    onMyReviewsClick={() => requireRole('MyReviews', ['Client'])}
                />
            )}

            {currentView === 'MyReservations' && (
                <MyReservationsPage
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('Landing')}
                    onAccountDetailsClick={() => alert('Pagina Detalii cont urmeaza.')}
                    onMyReservationsClick={() => requireRole('MyReservations', ['Client'])}
                    onMyReviewsClick={() => requireRole('MyReviews', ['Client'])}
                />
            )}

            {currentView === 'MyReviews' && (
                <MyReviewsPage
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('Landing')}
                    onAccountDetailsClick={() => alert('Pagina Detalii cont urmeaza.')}
                    onMyReservationsClick={() => requireRole('MyReservations', ['Client'])}
                    onMyReviewsClick={() => requireRole('MyReviews', ['Client'])}
                />
            )}

            {currentView === 'AdminDashboard' && (
                isAuthenticated && normalizedRole === 'admin' ? (
                    <AdminDashboardPage
                        userRole={role}
                        onLogout={handleLogout}
                        onBack={() => setCurrentView('Landing')}
                        onAccountClick={() => setCurrentView('Auth')}
                    />
                ) : (
                    <AuthPage
                        onAuthSuccess={(rolePayload, hasProfileCompleted) =>
                            handleAuthSuccess(rolePayload, hasProfileCompleted)
                        }
                        onBack={() => setCurrentView('Landing')}
                    />
                )
            )}
        </div>
    );
}