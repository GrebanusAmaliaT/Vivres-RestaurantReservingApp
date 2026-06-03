import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../../../components/tsx/Navbar';
import { Footer } from '../../../components/tsx/Footer';
import { apiService } from '../../../services/api';
import type {
    RestaurantEventMenuOptionDto,
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
    const [selectedEventTypeId, setSelectedEventTypeId] = useState<string>('');
    const [menuToAddId, setMenuToAddId] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const activeEventOptions = useMemo(() => {
        return eventOptions.filter(option => option.isEnabled);
    }, [eventOptions]);

    const selectedEventOption = useMemo(() => {
        return (
            activeEventOptions.find(option => option.eventTypeId === selectedEventTypeId) ??
            activeEventOptions[0] ??
            null
        );
    }, [activeEventOptions, selectedEventTypeId]);

    const activeMenus = selectedEventOption?.menuOptions.filter(menu => menu.isEnabled) ?? [];
    const availableMenusToAdd = selectedEventOption?.menuOptions.filter(menu => !menu.isEnabled) ?? [];

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await apiService.getManagerEventSettings();

            setAcceptsEvents(data.acceptsEvents);
            setEventOptions(data.eventOptions);

            const firstActiveEvent = data.eventOptions.find(option => option.isEnabled);
            setSelectedEventTypeId(firstActiveEvent?.eventTypeId ?? '');
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

    useEffect(() => {
        setMenuToAddId('');
    }, [selectedEventTypeId]);

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

    const updateMenuOption = (
        eventTypeId: string,
        menuTypeId: string,
        field: keyof RestaurantEventMenuOptionDto,
        value: string | number | boolean | null
    ) => {
        setEventOptions(prev =>
            prev.map(option =>
                option.eventTypeId === eventTypeId
                    ? {
                        ...option,
                        menuOptions: option.menuOptions.map(menu =>
                            menu.menuTypeId === menuTypeId
                                ? { ...menu, [field]: value }
                                : menu
                        )
                    }
                    : option
            )
        );
    };

    const setEventActive = (eventTypeId: string, isEnabled: boolean) => {
        setEventOptions(prev =>
            prev.map(option =>
                option.eventTypeId === eventTypeId
                    ? { ...option, isEnabled }
                    : option
            )
        );

        if (isEnabled) {
            setSelectedEventTypeId(eventTypeId);
            return;
        }

        if (selectedEventTypeId === eventTypeId) {
            const nextActiveEvent = eventOptions.find(
                option => option.eventTypeId !== eventTypeId && option.isEnabled
            );

            setSelectedEventTypeId(nextActiveEvent?.eventTypeId ?? '');
        }
    };

    const addMenuToSelectedEvent = () => {
        if (!selectedEventOption || !menuToAddId) return;

        updateMenuOption(
            selectedEventOption.eventTypeId,
            menuToAddId,
            'isEnabled',
            true
        );

        setMenuToAddId('');
    };

    const removeMenuFromSelectedEvent = (menuTypeId: string) => {
        if (!selectedEventOption) return;

        updateMenuOption(
            selectedEventOption.eventTypeId,
            menuTypeId,
            'isEnabled',
            false
        );
    };

    const getEventBasePrice = (option: RestaurantEventOptionDto): number => {
        const enabledMenuPrices = option.menuOptions
            .filter(menu => menu.isEnabled && Number(menu.pricePerPerson) > 0)
            .map(menu => Number(menu.pricePerPerson));

        if (enabledMenuPrices.length === 0) {
            return Number(option.pricePerPerson) || 0;
        }

        return Math.min(...enabledMenuPrices);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            const invalidEvents = eventOptions.filter(option =>
                acceptsEvents &&
                option.isEnabled &&
                (
                    !option.menuOptions.some(menu => menu.isEnabled && Number(menu.pricePerPerson) > 0) ||
                    Number(option.minPeople) <= 0 ||
                    (
                        option.maxPeople !== null &&
                        option.maxPeople !== undefined &&
                        Number(option.maxPeople) > 0 &&
                        Number(option.maxPeople) < Number(option.minPeople)
                    )
                )
            );

            if (invalidEvents.length > 0) {
                setError(
                    'Pentru fiecare eveniment activ trebuie sa ai minim persoane valid si cel putin un meniu activ cu pret valid. Max. persoane trebuie sa fie mai mare decat min. persoane.'
                );
                return;
            }

            const payload: UpdateRestaurantEventsDto = {
                acceptsEvents,
                eventOptions: eventOptions.map(option => ({
                    eventTypeId: option.eventTypeId,
                    isEnabled: acceptsEvents ? option.isEnabled : false,
                    pricePerPerson: getEventBasePrice(option),
                    minPeople: Number(option.minPeople) || 1,
                    maxPeople: option.maxPeople ? Number(option.maxPeople) : null,
                    details: option.details || '',
                    menuOptions: option.menuOptions.map(menu => ({
                        menuTypeId: menu.menuTypeId,
                        isEnabled: acceptsEvents && option.isEnabled ? menu.isEnabled : false,
                        pricePerPerson: Number(menu.pricePerPerson) || 0,
                        details: menu.details || ''
                    }))
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
                                Alege ce tipuri de evenimente organizeaza restaurantul, apoi
                                configureaza meniurile, preturile si numarul de persoane doar pentru
                                evenimentele active.
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
                    <div className="manager-event-type-selector">
                        <div>
                            <span className="manager-events-kicker">
                                Tipuri de evenimente
                            </span>
                            <h2>Selecteaza evenimentele organizate</h2>
                            <p>
                                Activeaza doar tipurile de evenimente pe care restaurantul chiar le
                                organizeaza. Dupa activare, configurezi cardul evenimentului selectat.
                            </p>
                        </div>

                        <div className="manager-event-type-chips">
                            {eventOptions.map(option => (
                                <button
                                    key={option.eventTypeId}
                                    type="button"
                                    disabled={!acceptsEvents}
                                    className={[
                                        'manager-event-type-chip',
                                        option.isEnabled ? 'active' : '',
                                        selectedEventOption?.eventTypeId === option.eventTypeId ? 'selected' : ''
                                    ].join(' ')}
                                    onClick={() => {
                                        if (!option.isEnabled) {
                                            setEventActive(option.eventTypeId, true);
                                        } else {
                                            setSelectedEventTypeId(option.eventTypeId);
                                        }
                                    }}
                                >
                                    <span>{option.eventTypeName}</span>
                                    <small>{option.isEnabled ? 'Activ' : 'Adauga'}</small>
                                </button>
                            ))}
                        </div>
                    </div>

                    {!selectedEventOption ? (
                        <div className="manager-events-empty-selection">
                            <h3>Nu ai activat niciun tip de eveniment</h3>
                            <p>
                                Alege din lista de mai sus ce tipuri de evenimente organizeaza
                                restaurantul tau.
                            </p>
                        </div>
                    ) : (
                        <article className="manager-selected-event-panel">
                            <div className="manager-selected-event-header">
                                <div>
                                    <span className="manager-events-kicker">
                                        {selectedEventOption.eventTypeCode}
                                    </span>
                                    <h2>{selectedEventOption.eventTypeName}</h2>
                                    <p>
                                        Configureaza meniurile disponibile, numarul de persoane si
                                        detaliile pentru acest tip de eveniment.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="manager-event-disable-btn"
                                    onClick={() => setEventActive(selectedEventOption.eventTypeId, false)}
                                >
                                    Dezactiveaza
                                </button>
                            </div>

                            <div className="manager-selected-event-grid">
                                <div className="manager-event-field">
                                    <label>Min. persoane</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={selectedEventOption.minPeople}
                                        disabled={!acceptsEvents}
                                        onChange={(e) =>
                                            updateOption(
                                                selectedEventOption.eventTypeId,
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
                                        value={selectedEventOption.maxPeople ?? ''}
                                        disabled={!acceptsEvents}
                                        onChange={(e) =>
                                            updateOption(
                                                selectedEventOption.eventTypeId,
                                                'maxPeople',
                                                e.target.value ? Number(e.target.value) : null
                                            )
                                        }
                                        placeholder="Optional"
                                    />
                                </div>

                                <div className="manager-event-field manager-event-field-full">
                                    <label>Detalii eveniment</label>
                                    <textarea
                                        rows={3}
                                        value={selectedEventOption.details ?? ''}
                                        disabled={!acceptsEvents}
                                        onChange={(e) =>
                                            updateOption(
                                                selectedEventOption.eventTypeId,
                                                'details',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ex: sala privata, decor inclus, personal dedicat, bauturi incluse..."
                                    />
                                </div>
                            </div>

                            <div className="manager-event-menu-picker">
                                <div>
                                    <span className="manager-events-kicker">
                                        Meniuri
                                    </span>
                                    <h3>Meniuri disponibile pentru acest eveniment</h3>
                                    <p>
                                        Adauga doar meniurile pe care restaurantul le ofera pentru acest
                                        tip de eveniment.
                                    </p>
                                </div>

                                <div className="manager-event-add-menu-row">
                                    <select
                                        value={menuToAddId}
                                        disabled={!acceptsEvents || availableMenusToAdd.length === 0}
                                        onChange={(e) => setMenuToAddId(e.target.value)}
                                    >
                                        <option value="">Alege meniu</option>
                                        {availableMenusToAdd.map(menu => (
                                            <option key={menu.menuTypeId} value={menu.menuTypeId}>
                                                {menu.menuTypeName}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        disabled={!menuToAddId || !acceptsEvents}
                                        onClick={addMenuToSelectedEvent}
                                    >
                                        Adauga meniu
                                    </button>
                                </div>
                            </div>

                            {activeMenus.length === 0 ? (
                                <div className="manager-no-menus-box">
                                    Nu ai adaugat inca meniuri pentru acest eveniment.
                                </div>
                            ) : (
                                <div className="manager-active-menus-list">
                                    {activeMenus.map(menu => (
                                        <div className="manager-active-menu-card" key={menu.menuTypeId}>
                                            <div className="manager-active-menu-header">
                                                <div>
                                                    <strong>{menu.menuTypeName}</strong>
                                                    <span>{menu.menuTypeCode}</span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeMenuFromSelectedEvent(menu.menuTypeId)}
                                                >
                                                    Elimina
                                                </button>
                                            </div>

                                            <div className="manager-active-menu-fields">
                                                <div className="manager-event-field">
                                                    <label>Pret / persoana</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={menu.pricePerPerson}
                                                        disabled={!acceptsEvents}
                                                        onChange={(e) =>
                                                            updateMenuOption(
                                                                selectedEventOption.eventTypeId,
                                                                menu.menuTypeId,
                                                                'pricePerPerson',
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="manager-event-field">
                                                    <label>Detalii meniu</label>
                                                    <input
                                                        type="text"
                                                        value={menu.details ?? ''}
                                                        disabled={!acceptsEvents}
                                                        onChange={(e) =>
                                                            updateMenuOption(
                                                                selectedEventOption.eventTypeId,
                                                                menu.menuTypeId,
                                                                'details',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Ex: include bauturi, desert, fel principal..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};