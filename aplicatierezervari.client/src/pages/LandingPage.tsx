import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ConceptSection } from '../components/Landing/ConceptSection';
import { MomentsSection } from '../components/Landing/MomentsSection';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

interface LandingPageProps {
    onNavigate: (view: 'Book a table' | 'Plan your event') => void;
    onAccountClick: () => void;
    userRole: string | null;
    onLogout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
    onNavigate, onAccountClick, userRole, onLogout
}) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: 'ro' | 'en') => {
        i18n.changeLanguage(lng);
    };

    return (
        <div
            className="container-fluid min-vh-screen d-flex flex-column justify-content-between p-4 p-md-5"
            style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}
        >

            <Navbar
                userRole={userRole}
                onAccountClick={onAccountClick}
                onLogout={onLogout}
            />

            <main className="container my-auto py-5">
                <div className="row align-items-center g-5">

                    <div className="col-lg-7 text-start">
                        <span className="text-uppercase small d-block mb-3" style={{ letterSpacing: '0.2em', color: '#999999', fontSize: '11px' }}>
                            {t('tagline')}
                        </span>

                        <h1 className="display-4 fw-normal lh-sm mb-4" style={{ color: '#1a1a1a' }}>
                            <span className="fw-bold text-dark">{t('titlePart1_bold')}</span>
                            {t('titlePart1_rest')}

                            <span className="fw-bold text-dark">{t('titlePart2_bold')}</span>
                            {t('titlePart2_rest')} <br />

                            <span className="font-elegant fst-italic" style={{ color: '#8b6508' }}>
                                <span className="fw-bold">{t('titlePart3_bold')}</span>
                                {t('titlePart3_rest')}
                            </span>
                        </h1>

                        <p className="lead fw-light" style={{ maxWidth: '540px', color: '#555555', fontSize: '17px', lineHeight: '1.6' }}>
                            {t('description')}
                        </p>
                    </div>

                    <div className="col-lg-5">
                        <div className="p-4 p-md-5 rounded-4 shadow-sm" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>

                            <div className="mb-4">
                                <h3 className="h6 text-uppercase tracking-wider fw-bold" style={{ color: '#555555', fontSize: '12px' }}>{t('cardTitle')}</h3>
                                <p className="small text-muted m-0">{t('cardSub')}</p>
                            </div>

                            <button
                                onClick={() => onNavigate('Book a table')}
                                className="btn d-flex align-items-center justify-content-between mb-3 w-100 bg-white shadow-none"
                                style={{ border: '1px solid #cccccc', borderRadius: '8px', padding: '20px', textAlign: 'left' }}
                            >
                                <div>
                                    <span className="d-block fw-bold text-uppercase small tracking-wide mb-1" style={{ color: '#1a1a1a' }}>
                                        {t('btn1Title')}
                                    </span>
                                    <span className="text-muted small fw-light d-block">
                                        {t('btn1Sub')}
                                    </span>
                                </div>
                                <span style={{ fontSize: '1.5rem', color: '#8b6508' }}>&rarr;</span>
                            </button>

                            <button
                                onClick={() => onNavigate('Plan your event')}
                                className="btn d-flex align-items-center justify-content-between w-100 bg-white shadow-none"
                                style={{ border: '1px solid #cccccc', borderRadius: '8px', padding: '20px', textAlign: 'left' }}
                            >
                                <div>
                                    <span className="d-block fw-bold text-uppercase small tracking-wide mb-1" style={{ color: '#1a1a1a' }}>
                                        {t('btn2Title')}
                                    </span>
                                    <span className="text-muted small fw-light d-block">
                                        {t('btn2Sub')}
                                    </span>
                                </div>
                                <span style={{ fontSize: '1.5rem', color: '#8b6508' }}>&rarr;</span>
                            </button>

                        </div>
                    </div>

                </div>
            </main>

            <MomentsSection onNavigate={onNavigate} />

            <ConceptSection />

            <Footer />

        </div>
    );
};