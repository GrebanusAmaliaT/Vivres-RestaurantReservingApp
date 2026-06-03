import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/Auth/AuthPage';
import { ManagerProfileSetup } from './pages/manager/tsx/ManagerProfileSetup';
import { ManagerDashboard } from './pages/manager/tsx/ManagerDashboard';
import { ManagerEventManagementPage } from './pages/manager/tsx/ManagerEventManagementPage';
import { RestaurantListingPage } from './pages/client/tsx/RestaurantListingPage';
import { ReservationPage } from './pages/client/tsx/ReservationPage';
import { RestaurantDto } from './types/index';
import { EventRestaurantListingPage } from './pages/client/tsx/EventRestaurantListingPage';
import { EventRestaurantDetailsPage } from './pages/client/tsx/EventRestaurantDetailsPage';
import { EventRestaurantListingDto } from './types/index';
import { EventReservationPage } from './pages/client/tsx/EventReservationPage';

type AppView =
    | 'Landing'
    | 'Auth'
    | 'ManagerSetup'
    | 'ManagerDashboard'
    | 'RestaurantListing'
    | 'Reservation'
    | 'Plan your event'
    | 'ManagerEvents'
    | 'EventRestaurantListing'
    | 'EventRestaurantDetails'
    | 'EventReservation';

export default function App() {
    const [role, setRole] = useState<string | null>(() => localStorage.getItem('vivres_role'));
    const [hasProfile, setHasProfile] = useState<boolean>(() => localStorage.getItem('vivres_has_profile') === 'true');
    const [currentView, setCurrentView] = useState<AppView>('Landing');
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantDto | null>(null);
    const [selectedEventRestaurant, setSelectedEventRestaurant] = useState<EventRestaurantListingDto | null>(null);

    useEffect(() => {
        if (role) {
            const lowRole = role.toLowerCase();

            if (lowRole === 'manager' || lowRole === 'restaurantmanager') {
                setCurrentView(hasProfile ? 'ManagerDashboard' : 'ManagerSetup');
            }
        }
    }, [role, hasProfile]);

    const handleNavigation = (view: 'Book a table' | 'Plan your event') => {
        if (view === 'Book a table') {
            setCurrentView('RestaurantListing');
            return;
        }

        setCurrentView('EventRestaurantListing');
    };

    const handleAuthSuccess = (userRole: string, profileCompletedBackend?: boolean) => {
        setRole(userRole);
        localStorage.setItem('vivres_role', userRole);

        const isProfileComplete = profileCompletedBackend === true;

        localStorage.setItem('vivres_has_profile', String(isProfileComplete));
        setHasProfile(isProfileComplete);

        if (userRole === 'RestaurantManager' ) {
            setCurrentView(isProfileComplete ? 'ManagerDashboard' : 'ManagerSetup');
        } else {
            setCurrentView('Landing');
        }
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
        setCurrentView('Landing');
    };

    const isUserAManager =
        role?.toLowerCase() === 'manager' ||
        role?.toLowerCase() === 'restaurantmanager';

    return (
        <div className="w-100 min-vh-screen" style={{ backgroundColor: '#ffffff' }}>

            {currentView === 'Auth' && (
                <AuthPage
                    //currentLang="RO"
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
                        if (isUserAManager) {
                            setCurrentView(hasProfile ? 'ManagerDashboard' : 'ManagerSetup');
                        } else {
                            setCurrentView('Auth');
                        }
                    }}
                    userRole={role}
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

            {currentView === 'RestaurantListing' && (
                <RestaurantListingPage
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('Landing')}
                    onSelectRestaurant={(restaurant) => {
                        setSelectedRestaurant(restaurant);
                        setCurrentView('Reservation');
                    }}
                />
            )}

            {currentView === 'Reservation' && (
                <ReservationPage
                    restaurant={selectedRestaurant}
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('RestaurantListing')}
                    onReservationSent={() => setCurrentView('RestaurantListing')}
                />
            )}

            {currentView === 'ManagerEvents' && (
                <ManagerEventManagementPage
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('ManagerDashboard')}
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
                />
            )}

            {currentView === 'EventReservation' && (
                <EventReservationPage
                    restaurant={selectedEventRestaurant}
                    userRole={role}
                    onLogout={handleLogout}
                    onBack={() => setCurrentView('EventRestaurantDetails')}
                    onRequestSent={() => setCurrentView('EventRestaurantListing')}
                />
            )}

        </div>
    );
}