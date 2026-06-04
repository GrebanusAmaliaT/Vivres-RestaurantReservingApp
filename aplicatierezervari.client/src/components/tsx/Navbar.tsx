import * as React from 'react';
import { useTranslation } from 'react-i18next';
import '../css/Navbar.css';

interface NavbarProps {
    userRole?: string | null;
    onAccountClick?: () => void;
    onLogout?: () => void;
    onBack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    userRole = null,
    onAccountClick,
    onLogout,
    onBack
}) => {
    const { t, i18n } = useTranslation();

    const displayRole = userRole ?? 'Guest';
    const normalizedRole = displayRole.toLowerCase();

    const isGuest = normalizedRole === 'guest';
    const isClient = normalizedRole === 'client';

    const shouldShowLogoutOutside =
        !isGuest &&
        !isClient &&
        Boolean(onLogout);

    const changeLanguage = (lng: 'ro' | 'en') => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="main-navbar">
            <span className="main-navbar-logo">
                Vivres
            </span>

            <div className="main-navbar-right">
                {onBack && (
                    <button
                        type="button"
                        className="main-navbar-back"
                        onClick={onBack}
                    >
                        ← Inapoi
                    </button>
                )}

                <div className="main-navbar-account-area">
                    <span className="main-navbar-role">
                        {displayRole}
                    </span>

                    {onAccountClick && (
                        <button
                            type="button"
                            className="main-navbar-account-btn"
                            onClick={onAccountClick}
                        >
                            {t('myAccount')}
                        </button>
                    )}

                    {shouldShowLogoutOutside && (
                        <button
                            type="button"
                            className="main-navbar-logout-btn"
                            onClick={onLogout}
                        >
                            {t('signOut')}
                        </button>
                    )}
                </div>

                <div className="main-navbar-language">
                    <span
                        className={
                            i18n.language.toLowerCase().startsWith('ro')
                                ? 'active'
                                : ''
                        }
                        onClick={() => changeLanguage('ro')}
                    >
                        RO
                    </span>

                    <span className="main-navbar-language-separator">|</span>

                    <span
                        className={
                            i18n.language.toLowerCase().startsWith('en')
                                ? 'active'
                                : ''
                        }
                        onClick={() => changeLanguage('en')}
                    >
                        EN
                    </span>
                </div>
            </div>
        </header>
    );
};