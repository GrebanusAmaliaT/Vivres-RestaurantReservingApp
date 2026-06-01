import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
    userRole: string | null;
    onAccountClick: () => void;
    onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userRole, onAccountClick, onLogout }) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: 'ro' | 'en') => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="w-full d-flex justify-content-between align-items-center pb-4 container-fluid px-0" style={{ borderBottom: '1px solid #e0e0e0' }}>
            <span className="text-uppercase tracking-wider fw-bold" style={{ letterSpacing: '0.2em', fontSize: '16px', color: '#1a1a1a' }}>
                Vivres
            </span>

            <div className="d-flex align-items-center gap-4">
                {userRole ? (
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-secondary font-monospace text-uppercase">{userRole}</span>
                        <button className="btn btn-link text-decoration-none p-0 text-danger small font-monospace shadow-none" onClick={onLogout}>
                            {t('signOut')}
                        </button>
                    </div>
                ) : (
                    <button
                        className="btn btn-link text-decoration-none p-0 font-elegant shadow-none"
                        style={{ color: '#1a1a1a', fontSize: '15px', fontStyle: 'italic' }}
                        onClick={onAccountClick}
                    >
                        {t('myAccount')}
                    </button>
                )}

                <div className="d-flex gap-2 align-items-center" style={{ fontSize: '12px', color: '#777777', fontWeight: 'bold' }}>
                    <span
                        style={{ cursor: 'pointer', color: i18n.language.toLowerCase().startsWith('ro') ? '#8b6508' : '#777777' }}
                        onClick={() => changeLanguage('ro')}
                    >
                        RO
                    </span>
                    <span className="text-muted">|</span>
                    <span
                        style={{ cursor: 'pointer', color: i18n.language.toLowerCase().startsWith('en') ? '#8b6508' : '#777777' }}
                        onClick={() => changeLanguage('en')}
                    >
                        EN
                    </span>
                </div>
            </div>
        </header>
    );
};