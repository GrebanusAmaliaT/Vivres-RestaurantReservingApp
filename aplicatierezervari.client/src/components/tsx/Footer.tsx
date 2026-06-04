import * as React from 'react';
import '../css/Footer.css';

export const Footer: React.FC = () => {
    return (
        <footer className="main-footer">
            <div>
                <p> 2026 Vivres | This is just a university project! | All rights reserved. </p>
                <p> DEVELOPED BY GREBANUS AMALIA-TEODORA </p>

            </div>
            <div className="main-footer-info">
                <span>Faculty of Mathematics and Computer Science</span>
                <span className="main-footer-location">Bucharest</span>
            </div>
        </footer>
    );
};