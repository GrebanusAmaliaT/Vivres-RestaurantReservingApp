import * as React from 'react';
import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/Auth/AuthPage';
import { ManagerProfileSetup } from './pages/Auth/ManagerProfileSetup';
import { ManagerDashboard } from './pages/ManagerDashboard';

type AppView = 'Landing' | 'Book a table' | 'Plan your event' | 'Auth' | 'ManagerSetup' | 'ManagerDashboard';

interface ReservationRequest {
    id: number;
    clientName: string;
    clientPhone: string;
    numberOfPersons: number;
    date: string;
    time: string;
    eventType: 'table' | 'event';
    notes?: string;
    status: 'pending' | 'approved' | 'rejected';
}

export default function App() {
    const [role, setRole] = useState<string | null>(() => localStorage.getItem('vivres_role'));
    const [hasProfile, setHasProfile] = useState<boolean>(() => localStorage.getItem('vivres_has_profile') === 'true');
    const [currentView, setCurrentView] = useState<AppView>('Landing');
    const [reservations, setReservations] = useState<ReservationRequest[]>([]);

    useEffect(() => {
        if (role) {
            const lowRole = role.toLowerCase();
            if (lowRole === 'manager' || lowRole === 'restaurantmanager') {
                setCurrentView(hasProfile ? 'ManagerDashboard' : 'ManagerSetup');
            }
        }
    }, [role, hasProfile]);

    const handleUpdateStatus = (id: number, newStatus: 'approved' | 'rejected') => {
        setReservations(prev =>
            prev.map(res => res.id === id ? { ...res, status: newStatus } : res)
        );
    };

    const handleNavigation = (view: 'Book a table' | 'Plan your event') => {
        setCurrentView(view);
    };

    const handleAuthSuccess = (userRole: string, profileCompletedBackend?: boolean) => {
        setRole(userRole);
        localStorage.setItem('vivres_role', userRole);

        const isProfileComplete = profileCompletedBackend !== undefined
            ? profileCompletedBackend
            : localStorage.getItem('vivres_has_profile') === 'true';

        localStorage.setItem('vivres_has_profile', String(isProfileComplete));
        setHasProfile(isProfileComplete);

        const normalizedRole = userRole.toLowerCase();
        if (normalizedRole === 'restaurantmanager' || normalizedRole === 'manager') {
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
        setRole(null);
        setHasProfile(false);
        setCurrentView('Landing');
    };

    const isUserAManager = role?.toLowerCase() === 'manager' || role?.toLowerCase() === 'restaurantmanager';

    return (
        <div className="w-100 min-vh-screen" style={{ backgroundColor: '#ffffff' }}>

            {currentView === 'Auth' && (
                <AuthPage
                    currentLang="RO"
                    onAuthSuccess={(rolePayload) => handleAuthSuccess(rolePayload)}
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
                <div>
                    <div className="bg-dark text-end px-4 py-2">
                        <button onClick={handleLogout} className="btn btn-link text-danger text-decoration-none shadow-none font-monospace text-uppercase btn-sm" style={{ fontSize: '11px' }}>
                            Iesire Cont →
                        </button>
                    </div>
                    <ManagerProfileSetup onSaveSuccess={handleProfileSaveSuccess} />
                </div>
            )}

            {currentView === 'ManagerDashboard' && (
                <div>
                    <div className="bg-dark text-end px-4 py-2">
                        <button onClick={() => setCurrentView('Landing')} className="btn btn-link text-warning text-decoration-none shadow-none font-monospace text-uppercase btn-sm me-3" style={{ fontSize: '11px' }}>
                            ← Vezi Site-ul Public
                        </button>
                        <button onClick={handleLogout} className="btn btn-link text-danger text-decoration-none shadow-none font-monospace text-uppercase btn-sm" style={{ fontSize: '11px' }}>
                            Deconectare →
                        </button>
                    </div>
                    <ManagerDashboard
                        restaurantName="Restaurantul Tau Vivres"
                        reservations={reservations}
                        onUpdateStatus={handleUpdateStatus}
                        onEditProfileClick={() => setCurrentView('ManagerSetup')}
                    />
                </div>
            )}

            {(currentView === 'Book a table' || currentView === 'Plan your event') && (
                <div>
                    <div className="bg-dark text-end px-4 py-2">
                        <button onClick={() => setCurrentView('Landing')} className="btn btn-link text-warning text-decoration-none shadow-none font-monospace text-uppercase btn-sm" style={{ fontSize: '11px' }}>
                            ← Inapoi la Acasa
                        </button>
                    </div>
                    <div className="container py-5 text-start">
                        <h2 className="h3 fw-bold text-capitalize">// {currentView}</h2>
                        <p className="text-muted">Aici se vor lista restaurantele din baza de date filtrate dupa criteriul selectat.</p>
                    </div>
                </div>
            )}
        </div>
    );
}