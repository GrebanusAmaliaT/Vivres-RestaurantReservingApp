import * as React from 'react';
import { useTranslation } from 'react-i18next';

export const ConceptSection: React.FC = () => {
    const { i18n } = useTranslation();

    const currentLang = i18n.language.toLowerCase().startsWith('en') ? 'en' : 'ro';

    const localTexts = {
        ro: {
            title: "Esența Vivres: Locul unde poveștile și stările se întâlnesc",
            intro: "Vivres s-a născut dintr-o dorință profundă și plină de pasiune: aceea de a aduce oamenii mai aproape unii de alții, indiferent de energia serii lor. Numele nostru poartă o promisiune ascunsă, o întrebare care ne amintește ce contează cu adevărat: Visezi Vreodată la Seara ta specială? Credem cu tărie că spațiul ideal se alege în funcție de starea pe care vrei să o trăiești.",
            p1: "Pentru momentele în doi, Vivres îți găsește refugiul Intim și Cald – acel loc perfect pentru cine romantice, scăldat în lumini difuze și muzica în surdină, unde timpul parcă se oprește în loc.",
            p2: "Când simți nevoia de conexiune pură și distracție, te ghidăm către o atmosferă Vibrantă și Energetică – decorul ideal pentru ieșiri memorabile cu gașca, seri cu muzică live și cocktailuri artizanale unde râsetele nu se opresc niciodată.",
            p3: "Iar pentru clipele care cer o notă de distincție, fie că este o întâlnire de afaceri crucială sau celebrarea unui succes personal, îți punem la dispoziție selecția Sofisticată și Minimalistă – spații dedicate experiențelor de fine dining, unde eleganța discretă și perfecțiunea culinară sunt la ele acasă. Vivres este puntea digitală care înțelege starea ta și o transformă în îmbrățișări, amintiri și clipe de neuitat."
        },
        en: {
            title: "The Essence of Vivres: Where Stories and Moods Meet",
            intro: "Vivres was born from a deep, passionate desire: to bring people closer together, no matter the energy of their evening. Our name carries a hidden promise, a question that reminds us of what truly matters: Visualize your dreams... special evenings? We firmly believe that the ideal venue should be chosen based on the mood you want to experience.",
            p1: "For those sacred moments for two, Vivres finds you an Intimate & Warm sanctuary – the perfect spot for romantic dinners, bathed in soft lights and low-key music, where time stands still.",
            p2: "When you crave pure connection and celebration, we guide you toward a Vibrant & Energetic atmosphere – the ultimate backdrop for memorable nights out with your crew, live music, and artisanal cocktails where laughter never ends.",
            p3: "And for those milestones that demand distinction, whether a crucial business meeting or celebrating a personal success, we offer a Sophisticated & Minimalist selection – spaces dedicated to fine dining experiences, where understated elegance and culinary perfection feel right at home. Vivres is the digital bridge that understands your mood and turns it into hugs, memories, and unforgettable moments."
        }
    };

    const text = localTexts[currentLang];

    return (
        <section className="container py-5 my-5 border-top" style={{ borderColor: '#e0e0e0' }}>
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">

                    <h2 className="h2 font-elegant fst-italic text-center mb-5" style={{ color: '#8b6508', letterSpacing: '0.05em' }}>
                        {text.title}
                    </h2>

                    <div className="text-start text-muted fw-light lh-lg" style={{ fontSize: '15.5px' }}>

                        <p className="mb-4 text-dark fw-normal" style={{ fontSize: '16.5px', lineHeight: '1.7' }}>
                            {text.intro}
                        </p>

                        <p className="mb-3 ps-3 border-start" style={{ borderColor: '#8b6508', borderLeftWidth: '2px' }}>
                            <span className="fw-semibold text-dark">{currentLang === 'ro' ? '• Intim & Cald: ' : '• Intimate & Warm: '}</span>
                            {text.p1}
                        </p>

                        <p className="mb-3 ps-3 border-start" style={{ borderColor: '#8b6508', borderLeftWidth: '2px' }}>
                            <span className="fw-semibold text-dark">{currentLang === 'ro' ? '• Vibrant & Energetic: ' : '• Vibrant & Energetic: '}</span>
                            {text.p2}
                        </p>

                        <p className="mb-4 ps-3 border-start" style={{ borderColor: '#8b6508', borderLeftWidth: '2px' }}>
                            <span className="fw-semibold text-dark">{currentLang === 'ro' ? '• Sofisticat & Minimalist: ' : '• Sophisticated & Minimalist: '}</span>
                            {text.p3}
                        </p>

                    </div>

                </div>
            </div>
        </section>
    );
};