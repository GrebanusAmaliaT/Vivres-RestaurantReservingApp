import * as React from 'react';
import { useTranslation } from 'react-i18next';
import '../css/NavbarClient.css';
interface ClientNavbarProps {
    userRole?: string | null;
    onBack?: () => void;
    onLogout: () => void;
    onAccountDetailsClick: () => void;
    onMyReservationsClick: () => void;
    onMyReviewsClick: () => void;
}

export const ClientNavbar: React.FC<ClientNavbarProps> = ({
    userRole = null,
    onBack,
    onLogout,
    onAccountDetailsClick,
    onMyReservationsClick,
    onMyReviewsClick
}) => {
    const { i18n } = useTranslation();
    const [isAccountMenuOpen, setIsAccountMenuOpen] = React.useState(false);

    const changeLanguage = (lng: 'ro' | 'en') => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="client-navbar">
            <div className="client-navbar-inner">
                <span className="client-navbar-logo">
                    Vivres
                </span>

                {onBack && (
                    <button
                        type="button"
                        className="client-navbar-back"
                        onClick={onBack}
                    >
                        ← Inapoi
                    </button>
                )}

                {userRole && (
                    <span className="client-navbar-role">
                        {userRole}
                    </span>
                )}

                <div className="client-account-dropdown">
                    <button
                        type="button"
                        className="client-account-trigger"
                        onClick={() => setIsAccountMenuOpen(prev => !prev)}
                    >
                        Contul Meu
                    </button>

                    {isAccountMenuOpen && (
                        <div className="client-account-dropdown-menu">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAccountMenuOpen(false);
                                    onAccountDetailsClick();
                                }}
                            >
                                Detalii cont
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsAccountMenuOpen(false);
                                    onMyReservationsClick();
                                }}
                            >
                                Rezervarile mele
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsAccountMenuOpen(false);
                                    onMyReviewsClick();
                                }}
                            >
                                Reviewurile mele
                            </button>

                            <button
                                type="button"
                                className="danger"
                                onClick={() => {
                                    setIsAccountMenuOpen(false);
                                    onLogout();
                                }}
                            >
                                Deconectare
                            </button>
                        </div>
                    )}
                </div>

                <div className="client-navbar-language">
                    <span
                        className={i18n.language.toLowerCase().startsWith('ro') ? 'active' : ''}
                        onClick={() => changeLanguage('ro')}
                    >
                        RO
                    </span>

                    <span className="client-navbar-separator">|</span>

                    <span
                        className={i18n.language.toLowerCase().startsWith('en') ? 'active' : ''}
                        onClick={() => changeLanguage('en')}
                    >
                        EN
                    </span>
                </div>
            </div>
        </header>
    );
};