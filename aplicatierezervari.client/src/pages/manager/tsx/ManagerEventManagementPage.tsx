import { useEffect, useState } from 'react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { apiService } from '../../../services/api';
import type {
    RestaurantEventOptionDto,
    UpdateRestaurantEventsDto
} from '../../../types/index';
import '../css/ManagerEventManagementPage.css';

interface ManagerEventManagementPageProps {
    userRole: string | null;
    onLogout: () => void;
    onBack: () => void;
}

export const ManagerEventManagementPage: React.FC<ManagerEventManagementPageProps> = ({
    userRole,
    onLogout,
    onBack
}) => {
    const [acceptsEvents, setAcceptsEvents] = useState<boolean>(false);
    const [eventOptions, setEventOptions] = useState<RestaurantEventOptionDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await apiService.getManagerEventSettings();

            setAcceptsEvents(data.acceptsEvents);
            setEventOptions(data.eventOptions);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Nu s-au putut incarca setarile pentru evenimente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const updateOption = (
        eventTypeId: string,
        field: keyof RestaurantEventOptionDto,
        value: string | number | boolean | null
    ) => {
        setEventOptions(prev =>
            prev.map(option =>
                option.eventTypeId === eventTypeId
                    ? { ...option, [field]: value }
                    : option
            )
        );
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            const payload: UpdateRestaurantEventsDto = {
                acceptsEvents,
                eventOptions: eventOptions.map(option => ({
                    eventTypeId: option.eventTypeId,
                    isEnabled: acceptsEvents ? option.isEnabled : false,
                    pricePerPerson: Number(option.pricePerPerson) || 0,
                    minPeople: Number(option.minPeople) || 1,
                    maxPeople: option.maxPeople ? Number(option.maxPeople) : null,
                    details: option.details || ''
                }))
            };

            await apiService.updateManagerEventSettings(payload);

            alert('Setarile pentru evenimente au fost salvate.');
            await loadSettings();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Nu s-au putut salva setarile pentru evenimente.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="manager-events-page">
                <Navbar
                    userRole={userRole}
                    onLogout={onLogout}
                    onBack={onBack}
                />

                <div className="container py-5 text-center">
                    <div className="spinner-border text-dark" role="status"></div>
                    <p className="mt-3 text-muted font-monospace small">
                        Se incarca setarile pentru evenimente...
                    </p>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="manager-events-page">
            <Navbar
                userRole={userRole}
                onLogout={onLogout}
                onBack={onBack}
            />

            <main className="manager-events-container">
                <section className="manager-events-header">
                    <span className="manager-events-kicker">
                        Event management
                    </span>

                    <div className="manager-events-title-row">
                        <div>
                            <h1>Configurare evenimente speciale</h1>
                            <p>
                                Alege ce tipuri de evenimente organizeaza restaurantul si seteaza
                                pretul, numarul de persoane si detaliile pentru fiecare.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="manager-events-save-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Se salveaza...' : 'Salveaza'}
                        </button>
                    </div>
                </section>

                {error && (
                    <div className="alert alert-danger small font-monospace">
                        {error}
                    </div>
                )}

                <section className="manager-events-global-card">
                    <div>
                        <span className="manager-events-kicker">
                            Setare generala
                        </span>
                        <h2>Restaurantul organizeaza evenimente?</h2>
                        <p>
                            Daca aceasta optiune este oprita, restaurantul nu va aparea in pagina
                            clientilor pentru planificarea evenimentelor.
                        </p>
                    </div>

                    <label className="manager-events-main-toggle">
                        <input
                            type="checkbox"
                            checked={acceptsEvents}
                            onChange={(e) => setAcceptsEvents(e.target.checked)}
                        />
                        <span>{acceptsEvents ? 'Activ' : 'Inactiv'}</span>
                    </label>
                </section>

                <section className={!acceptsEvents ? 'manager-events-disabled-section' : ''}>
                    <div className="manager-events-grid">
                        {eventOptions.map(option => (
                            <article className="manager-event-card" key={option.eventTypeId}>
                                <div className="manager-event-card-header">
                                    <div>
                                        <span className="manager-events-kicker">
                                            {option.eventTypeCode}
                                        </span>
                                        <h3>{option.eventTypeName}</h3>
                                    </div>

                                    <label className="manager-event-toggle">
                                        <input
                                            type="checkbox"
                                            checked={option.isEnabled}
                                            disabled={!acceptsEvents}
                                            onChange={(e) =>
                                                updateOption(
                                                    option.eventTypeId,
                                                    'isEnabled',
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span>{option.isEnabled ? 'Activ' : 'Inactiv'}</span>
                                    </label>
                                </div>

                                <div className="manager-event-fields">
                                    <div className="manager-event-field">
                                        <label>Pret / persoana</label>
                                        <input
                                            type="number"
                                            min={0}
                                            step={1}
                                            value={option.pricePerPerson}
                                            disabled={!acceptsEvents || !option.isEnabled}
                                            onChange={(e) =>
                                                updateOption(
                                                    option.eventTypeId,
                                                    'pricePerPerson',
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="manager-event-field">
                                        <label>Min. persoane</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={option.minPeople}
                                            disabled={!acceptsEvents || !option.isEnabled}
                                            onChange={(e) =>
                                                updateOption(
                                                    option.eventTypeId,
                                                    'minPeople',
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="manager-event-field">
                                        <label>Max. persoane</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={option.maxPeople ?? ''}
                                            disabled={!acceptsEvents || !option.isEnabled}
                                            onChange={(e) =>
                                                updateOption(
                                                    option.eventTypeId,
                                                    'maxPeople',
                                                    e.target.value ? Number(e.target.value) : null
                                                )
                                            }
                                            placeholder="Optional"
                                        />
                                    </div>

                                    <div className="manager-event-field manager-event-field-full">
                                        <label>Detalii</label>
                                        <textarea
                                            rows={3}
                                            value={option.details ?? ''}
                                            disabled={!acceptsEvents || !option.isEnabled}
                                            onChange={(e) =>
                                                updateOption(
                                                    option.eventTypeId,
                                                    'details',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ex: meniu complet, bauturi incluse, decor inclus, sala privata..."
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};