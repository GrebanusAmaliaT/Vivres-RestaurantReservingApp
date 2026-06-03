import * as React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer
            className="w-full pt-4 mt-auto d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 font-monospace small text-uppercase tracking-wider container"
            style={{ borderTop: '1px solid #e0e0e0', color: '#777777', fontSize: '11px' }}
        >
            <div>© 2026 Vivres • Acesta este doar un Proiect pentru Facultate!</div>
            <div className="d-flex gap-4">
                <span>Faculty of Mathematics and Computer Science</span>
                <span className="fw-bold" style={{ color: '#1a1a1a' }}>Bucharest</span>
            </div>
        </footer>
    );
};