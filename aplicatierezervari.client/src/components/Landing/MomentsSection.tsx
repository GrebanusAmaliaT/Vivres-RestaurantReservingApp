import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface MomentsSectionProps {
    onNavigate: (view: 'Book a table' | 'Plan your event') => void;
}

export const MomentsSection: React.FC<MomentsSectionProps> = ({ onNavigate }) => {
    const { t } = useTranslation();

    const romanticImages = [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80'
    ];

    const vibrantImages = [
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80'
    ];

    const eventImages = [
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop'
    ];

    const [romanticIdx, setRomanticIdx] = useState(0);
    const [vibrantIdx, setVibrantIdx] = useState(0);
    const [eventIdx, setEventIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRomanticIdx((prev) => (prev + 1) % romanticImages.length);
            setVibrantIdx((prev) => (prev + 1) % vibrantImages.length);
            setEventIdx((prev) => (prev + 1) % eventImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const prevRomantic = () => setRomanticIdx((prev) => (prev - 1 + romanticImages.length) % romanticImages.length);
    const nextRomantic = () => setRomanticIdx((prev) => (prev + 1) % romanticImages.length);

    const prevVibrant = () => setVibrantIdx((prev) => (prev - 1 + vibrantImages.length) % vibrantImages.length);
    const nextVibrant = () => setVibrantIdx((prev) => (prev + 1) % vibrantImages.length);

    const prevEvent = () => setEventIdx((prev) => (prev - 1 + eventImages.length) % eventImages.length);
    const nextEvent = () => setEventIdx((prev) => (prev + 1) % eventImages.length);

    return (
        <section className="container py-5 my-4">

            <div className="text-center mb-5 pb-3">
                <h2 className="h2 font-elegant fst-italic tracking-wide" style={{ color: '#1a1a1a' }}>
                    {t('momenteTitle')}
                </h2>
                <p className="text-uppercase small tracking-widest text-muted mt-2" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
                    {t('momenteSub')}
                </p>
            </div>

            <div className="row align-items-center g-5 mb-5 pb-5 border-bottom border-light">
                <div className="col-lg-5 text-start">
                    <span className="text-uppercase font-monospace text-muted small d-block mb-2" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>// 01 . Intim & Cald</span>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#1a1a1a' }}>{t('cardIntimTitle')}</h3>
                    <p className="text-muted fw-light lh-relaxed mb-4" style={{ fontSize: '15px' }}>{t('cardIntimBody')}</p>
                    <button
                        onClick={() => onNavigate('Book a table')}
                        className="btn btn-dark px-4 py-2 text-uppercase font-monospace shadow-none"
                        style={{ borderRadius: '6px', fontSize: '12px', letterSpacing: '0.1em' }}
                    >
                        {t('cardIntimAction')} &rarr;
                    </button>
                </div>

                <div className="col-lg-7">
                    <div className="position-relative shadow rounded-4 overflow-hidden" style={{ height: '380px' }}>
                        <div className="w-100 h-100 position-relative">
                            {romanticImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="position-absolute top-0 start-0 w-100 h-100"
                                    style={{
                                        opacity: index === romanticIdx ? 1 : 0,
                                        transition: 'opacity 0.8s ease-in-out',
                                        zIndex: index === romanticIdx ? 1 : 0
                                    }}
                                >
                                    <img src={img} className="w-100 h-100 object-fit-cover" alt="Moment romantic" />
                                </div>
                            ))}
                        </div>

                        <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 pb-3" style={{ zIndex: 5 }}>
                            {romanticImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setRomanticIdx(idx)}
                                    className={`border-0 rounded-circle p-0 ${idx === romanticIdx ? 'bg-white' : 'bg-white-50'}`}
                                    style={{ width: '8px', height: '8px', opacity: idx === romanticIdx ? 1 : 0.5, transition: 'all 0.3s' }}
                                />
                            ))}
                        </div>

                        <button className="position-absolute top-50 start-0 translate-middle-y btn text-white border-0 shadow-none fs-3" style={{ zIndex: 5, background: 'transparent' }} onClick={prevRomantic}>&#8249;</button>
                        <button className="position-absolute top-50 end-0 translate-middle-y btn text-white border-0 shadow-none fs-3" style={{ zIndex: 5, background: 'transparent' }} onClick={nextRomantic}>&#8250;</button>
                    </div>
                </div>
            </div>

            <div className="row align-items-center g-5 mb-5 pb-5 border-bottom border-light">
                <div className="col-lg-7 order-2 order-lg-1">
                    <div className="position-relative shadow rounded-4 overflow-hidden" style={{ height: '380px' }}>
                        <div className="w-100 h-100 position-relative">
                            {vibrantImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="position-absolute top-0 start-0 w-100 h-100"
                                    style={{
                                        opacity: index === vibrantIdx ? 1 : 0,
                                        transition: 'opacity 0.8s ease-in-out',
                                        zIndex: index === vibrantIdx ? 1 : 0
                                    }}
                                >
                                    <img src={img} className="w-100 h-100 object-fit-cover" alt="Iesire cu gasca" />
                                </div>
                            ))}
                        </div>

                        <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 pb-3" style={{ zIndex: 5 }}>
                            {vibrantImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setVibrantIdx(idx)}
                                    className={`border-0 rounded-circle p-0 ${idx === vibrantIdx ? 'bg-white' : 'bg-white-50'}`}
                                    style={{ width: '8px', height: '8px', opacity: idx === vibrantIdx ? 1 : 0.5, transition: 'all 0.3s' }}
                                />
                            ))}
                        </div>

                        <button className="position-absolute top-50 start-0 translate-middle-y btn text-white border-0 shadow-none fs-3" style={{ zIndex: 5, background: 'transparent' }} onClick={prevVibrant}>&#8249;</button>
                        <button className="position-absolute top-50 end-0 translate-middle-y btn text-white border-0 shadow-none fs-3" style={{ zIndex: 5, background: 'transparent' }} onClick={nextVibrant}>&#8250;</button>
                    </div>
                </div>

                <div className="col-lg-5 order-1 order-lg-2 text-start">
                    <span className="text-uppercase font-monospace text-muted small d-block mb-2" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>// 02 . Vibrant & Energetic</span>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#1a1a1a' }}>{t('cardVibrantTitle')}</h3>
                    <p className="text-muted fw-light lh-relaxed mb-4" style={{ fontSize: '15px' }}>{t('cardVibrantBody')}</p>
                    <button
                        onClick={() => onNavigate('Book a table')}
                        className="btn btn-dark px-4 py-2 text-uppercase font-monospace shadow-none"
                        style={{ borderRadius: '6px', fontSize: '12px', letterSpacing: '0.1em' }}
                    >
                        {t('cardVibrantAction')} &rarr;
                    </button>
                </div>
            </div>

            <div className="row align-items-center g-5">
                <div className="col-lg-5 text-start">
                    <span className="text-uppercase font-monospace text-muted small d-block mb-2" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>// 03 . Sofisticat & Minimalist</span>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#1a1a1a' }}>{t('cardEventTitle')}</h3>
                    <p className="text-muted fw-light lh-relaxed mb-4" style={{ fontSize: '15px' }}>{t('cardEventBody')}</p>
                    <button
                        onClick={() => onNavigate('Plan your event')}
                        className="btn btn-dark px-4 py-2 text-uppercase font-monospace shadow-none"
                        style={{ borderRadius: '6px', fontSize: '12px', letterSpacing: '0.1em' }}
                    >
                        {t('cardEventAction')} &rarr;
                    </button>
                </div>

                <div className="col-lg-7">
                    <div className="position-relative shadow rounded-4 overflow-hidden" style={{ height: '380px' }}>
                        <div className="w-100 h-100 position-relative">
                            {eventImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="position-absolute top-0 start-0 w-100 h-100"
                                    style={{
                                        opacity: index === eventIdx ? 1 : 0,
                                        transition: 'opacity 0.8s ease-in-out',
                                        zIndex: index === eventIdx ? 1 : 0
                                    }}
                                >
                                    <img src={img} className="w-100 h-100 object-fit-cover" alt="Eveniment special" />
                                </div>
                            ))}
                        </div>

                        <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 pb-3" style={{ zIndex: 5 }}>
                            {eventImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setEventIdx(idx)}
                                    className={`border-0 rounded-circle p-0 ${idx === eventIdx ? 'bg-white' : 'bg-white-50'}`}
                                    style={{ width: '8px', height: '8px', opacity: idx === eventIdx ? 1 : 0.5, transition: 'all 0.3s' }}
                                />
                            ))}
                        </div>

                        <button className="position-absolute top-50 start-0 translate-middle-y btn text-white border-0 shadow-none fs-3" style={{ zIndex: 5, background: 'transparent' }} onClick={prevEvent}>&#8249;</button>
                        <button className="position-absolute top-50 end-0 translate-middle-y btn text-white border-0 shadow-none fs-3" style={{ zIndex: 5, background: 'transparent' }} onClick={nextEvent}>&#8250;</button>
                    </div>
                </div>
            </div>

        </section>
    );
};