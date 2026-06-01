import * as React from 'react';
import { useState, useEffect } from 'react';
import '../css/ManagerProfileSetup.css';

import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
interface ManagerProfileSetupProps {
    onSaveSuccess: () => void;
    userRole: string | null;
    onLogout: () => void;
    onBack?: () => void;
}

type TabType = 'general' | 'filters' | 'location' | 'images';
interface CatalogItemDto {
    id: string;
    name: string;
}

export const ManagerProfileSetup: React.FC<ManagerProfileSetupProps> = ({
    onSaveSuccess,
    userRole,
    onLogout,
    onBack
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const [globalCuisines, setGlobalCuisines] = useState<CatalogItemDto[]>([]);
    const [globalFacilities, setGlobalFacilities] = useState<CatalogItemDto[]>([]);

    const [formData, setFormData] = useState({
        cityId: localStorage.getItem('vivres_city_id') || '',

        name: '',
        description: '',
        averageBudget: 0,
        capacity: 50,
        openingTime: '08:00',
        closingTime: '18:00',
        defaultReservationDurationInHours: 2,
        address: '',
        latitude: '44.4268',
        longitude: '26.1025',
        mood: 0,

        selectedFacilityIds: [] as string[],
        selectedCuisineIds: [] as string[],

        otherFacilities: '',

        imageFile1: null as File | null,
        imageFile2: null as File | null,
        imageFile3: null as File | null
    });

    const [previews, setPreviews] = useState({
        image1: '',
        image2: '',
        image3: ''
    });

    useEffect(() => {
        const loadCatalogAndProfile = async () => {
            try {
                const headers = { 'Authorization': `Bearer ${localStorage.getItem('vivres_token')}` };

                const cuisineRes = await fetch('https://localhost:7065/api/Restaurants/cuisines', { headers });
                let cuisinesData: CatalogItemDto[] = [];
                if (cuisineRes.ok) {
                    cuisinesData = await cuisineRes.json();
                    setGlobalCuisines(cuisinesData);
                }

                const facilityRes = await fetch('https://localhost:7065/api/Restaurants/facilities', { headers });
                if (facilityRes.ok) {
                    const facilitiesData = await facilityRes.json();
                    setGlobalFacilities(facilitiesData);
                }

                const response = await fetch('https://localhost:7065/api/Restaurants/my-restaurant', {
                    method: 'GET',
                    headers
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.cityId) {
                        localStorage.setItem('vivres_city_id', data.cityId);
                    }

                    setIsEditMode(true);

                    setFormData({
                        cityId: data.cityId || localStorage.getItem('vivres_city_id') || '',

                        name: data.name || '',
                        description: data.description || '',
                        averageBudget: data.averageBudget || 0,
                        capacity: data.capacity || 50,
                        openingTime: data.openingTime ? data.openingTime.substring(0, 5) : '08:00',
                        closingTime: data.closingTime ? data.closingTime.substring(0, 5) : '18:00',
                        defaultReservationDurationInHours: data.defaultReservationDurationInHours || 2,
                        address: data.address || '',
                        latitude: data.latitude?.toString() || '44.4268',
                        longitude: data.longitude?.toString() || '26.1025',
                        mood: data.mood ?? 0,

                        selectedFacilityIds: data.standardFacilities || [],
                        selectedCuisineIds: data.cuisineTypeIds || [],

                        otherFacilities: data.otherFacilities || '',
                        imageFile1: null,
                        imageFile2: null,
                        imageFile3: null
                    });

                    setPreviews({
                        image1: data.image1Url ? `https://localhost:7065${data.image1Url}` : '',
                        image2: data.image2Url ? `https://localhost:7065${data.image2Url}` : '',
                        image3: data.image3Url ? `https://localhost:7065${data.image3Url}` : '',
                    });
                }
            } catch (error) {
                console.error("Eroare la încărcarea datelor dinamice:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCatalogAndProfile();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        let parsedValue: string | number = value;

        if (
            name === 'mood' ||
            name === 'capacity' ||
            name === 'averageBudget' ||
            name === 'defaultReservationDurationInHours'
        ) {
            parsedValue = Number(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    const handleDynamicCheckboxChange = (field: 'selectedFacilityIds' | 'selectedCuisineIds', id: string, checked: boolean) => {
        setFormData(prev => {
            const list = [...prev[field]];
            if (checked) {
                if (!list.includes(id)) list.push(id);
            } else {
                return { ...prev, [field]: list.filter(item => item !== id) };
            }
            return { ...prev, [field]: list };
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, previewKey: 'image1' | 'image2' | 'image3') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, [fieldName]: file }));
            setPreviews(prev => ({ ...prev, [previewKey]: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSend = new FormData();

        const cityId = formData.cityId || localStorage.getItem('vivres_city_id');

        console.log("CITY ID TRIMIS:", cityId);

        if (!cityId) {
            alert("Nu există CityId. Deloghează-te și loghează-te din nou.");
            return;
        }

        dataToSend.append('CityId', cityId);

        dataToSend.append('Name', formData.name);
        dataToSend.append('Address', formData.address);
        dataToSend.append('Description', formData.description);
        dataToSend.append('Capacity', formData.capacity.toString());
        dataToSend.append('AverageBudget', formData.averageBudget.toString());
        dataToSend.append('OpeningTime', `${formData.openingTime}:00`);
        dataToSend.append('ClosingTime', `${formData.closingTime}:00`);
        dataToSend.append(
            'DefaultReservationDurationInHours',
            formData.defaultReservationDurationInHours.toString()
        );

        dataToSend.append('Latitude', formData.latitude);
        dataToSend.append('Longitude', formData.longitude);
        dataToSend.append('Mood', formData.mood.toString());
        dataToSend.append('OtherFacilities', formData.otherFacilities || '');

        formData.selectedFacilityIds.forEach(id => {
            dataToSend.append('StandardFacilities', id);
        });
        formData.selectedCuisineIds.forEach(id => {
            dataToSend.append('CuisineTypes', id);
        });

        if (formData.imageFile1) dataToSend.append('ImageFile1', formData.imageFile1);
        if (formData.imageFile2) dataToSend.append('ImageFile2', formData.imageFile2);
        if (formData.imageFile3) dataToSend.append('ImageFile3', formData.imageFile3);

        try {
            const response = await fetch('https://localhost:7065/api/Restaurants/setup', {
                method: 'POST',
                body: dataToSend,
                headers: { 'Authorization': `Bearer ${localStorage.getItem('vivres_token')}` }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Eroare backend la salvare:", errorText);
                throw new Error(errorText);
            }

            alert('Datele restaurantului au fost salvate cu succes!');
            onSaveSuccess();
        } catch (error) {
            console.error(error);
            alert('A apărut o problemă la salvarea datelor. Verifică consola pentru detalii.');
        }
    };

    const getTabButtonClass = (tab: TabType) =>
        `btn flex-fill py-3 px-2 border-0 shadow-none rounded-0 small fw-bold text-uppercase ${activeTab === tab
            ? 'text-dark border-bottom border-3 border-dark bg-white'
            : 'text-secondary bg-transparent'
        }`;

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark" role="status"></div>
                <p className="mt-3 font-monospace text-muted small">
                    Se incarca profilul restaurantului...
                </p>
            </div>
        );
    }

    return (
        <div className="manager-profile-page">
            <Navbar
                userRole={userRole}
                onLogout={onLogout}
                onBack={onBack}
            />
            <div className="container py-5 text-start profile-setup-max-width">
            <div className="text-center mb-5">
                <span className="text-uppercase font-monospace text-muted small header-tracking-wider">
                    Restaurant profile
                </span>

                <h2 className="fw-bold mt-2 mb-2">
                    {isEditMode ? 'Editeaza profilul restaurantului' : 'Configureaza profilul restaurantului'}
                </h2>

                <p className="text-muted small mb-0">
                    Completeaza informatiile principale, filtrele, locatia si galeria foto.
                </p>
            </div>

            <div className="bg-white border rounded-4 shadow-sm overflow-hidden">
                <div className="d-flex border-bottom font-monospace">
                    <button
                        type="button"
                        className={getTabButtonClass('general')}
                        onClick={() => setActiveTab('general')}
                    >
                        1. General
                    </button>

                    <button
                        type="button"
                        className={getTabButtonClass('filters')}
                        onClick={() => setActiveTab('filters')}
                    >
                        2. Filtre
                    </button>

                    <button
                        type="button"
                        className={getTabButtonClass('location')}
                        onClick={() => setActiveTab('location')}
                    >
                        3. Locatie
                    </button>

                    <button
                        type="button"
                        className={getTabButtonClass('images')}
                        onClick={() => setActiveTab('images')}
                    >
                        4. Galerie
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 p-md-5">
                    {activeTab === 'general' && (
                        <div>
                            <div className="mb-4">
                                <h3 className="h6 fw-bold text-uppercase text-dark mb-1 section-title-style">
                                    Informatii generale
                                </h3>
                                <p className="text-muted small mb-0">
                                    Aceste date vor fi vizibile pentru clientii care cauta restaurante.
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                    Nume restaurant
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control shadow-none py-2 setup-input-style"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                        Buget mediu / persoana
                                    </label>
                                    <input
                                        type="number"
                                        name="averageBudget"
                                        className="form-control shadow-none py-2 setup-input-style"
                                        value={formData.averageBudget}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                        Capacitate maxima
                                    </label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        className="form-control shadow-none py-2 setup-input-style"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                            Ora deschidere
                                        </label>
                                        <input
                                            type="time"
                                            name="openingTime"
                                            className="form-control shadow-none py-2 setup-input-style"
                                            value={formData.openingTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                            Ora inchidere
                                        </label>
                                        <input
                                            type="time"
                                            name="closingTime"
                                            className="form-control shadow-none py-2 setup-input-style"
                                            value={formData.closingTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                            Durata rezervare
                                        </label>
                                        <input
                                            type="number"
                                            name="defaultReservationDurationInHours"
                                            className="form-control shadow-none py-2 setup-input-style"
                                            value={formData.defaultReservationDurationInHours}
                                            onChange={handleInputChange}
                                            min={0.5}
                                            max={8}
                                            step={0.5}
                                            required
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                    Descriere scurta
                                </label>
                                <textarea
                                    name="description"
                                    className="form-control shadow-none setup-input-style"
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <button
                                    type="button"
                                    className="btn btn-dark btn-sm px-4 py-2 text-uppercase font-monospace"
                                    onClick={() => setActiveTab('filters')}
                                >
                                    Inainte
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'filters' && (
                        <div>
                            <div className="mb-4">
                                <h3 className="h6 fw-bold text-uppercase text-dark mb-1 section-title-style">
                                    Filtre si preferinte
                                </h3>
                                <p className="text-muted small mb-0">
                                    Aceste optiuni ajuta clientii sa gaseasca restaurantul potrivit.
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                    Stil / atmosfera
                                </label>
                                <select
                                    name="mood"
                                    className="form-select shadow-none py-2 setup-input-style"
                                    value={formData.mood}
                                    onChange={handleInputChange}
                                >
                                    <option value={0}>Intim si cald</option>
                                    <option value={1}>Romantic</option>
                                    <option value={2}>Elegant si rafinat</option>
                                    <option value={3}>Vibrant si energetic</option>
                                    <option value={4}>Familial</option>
                                    <option value={5}>Traditional</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted mb-2 section-title-style">
                                    Tipuri de bucatarie
                                </label>

                                <div className="row g-2 border rounded-4 p-3 m-0 catalog-box-bg">
                                    {globalCuisines.map(cuisine => (
                                        <div className="col-6 col-md-4" key={cuisine.id}>
                                            <div className="form-check bg-white border rounded-3 px-3 py-2 h-100">
                                                <input
                                                    className="form-check-input shadow-none me-2"
                                                    type="checkbox"
                                                    id={`cuisine-${cuisine.id}`}
                                                    checked={formData.selectedCuisineIds.includes(cuisine.id)}
                                                    onChange={(e) =>
                                                        handleDynamicCheckboxChange('selectedCuisineIds', cuisine.id, e.target.checked)
                                                    }
                                                />
                                                <label
                                                    className="form-check-label small fw-semibold text-dark"
                                                    htmlFor={`cuisine-${cuisine.id}`}
                                                >
                                                    {cuisine.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted mb-2 section-title-style">
                                    Facilitati standard
                                </label>

                                <div className="row g-3 m-0 p-3 border rounded-4 catalog-box-bg">
                                    {globalFacilities.map(facility => (
                                        <div className="col-md-6" key={facility.id}>
                                            <div className="form-check form-switch bg-white border rounded-3 p-3 h-100 d-flex align-items-center facility-switch-card">
                                                <input
                                                    className="form-check-input shadow-none me-3"
                                                    type="checkbox"
                                                    id={`fac-${facility.id}`}
                                                    checked={formData.selectedFacilityIds.includes(facility.id)}
                                                    onChange={(e) =>
                                                        handleDynamicCheckboxChange('selectedFacilityIds', facility.id, e.target.checked)
                                                    }
                                                />
                                                <label
                                                    className="form-check-label small fw-semibold text-dark"
                                                    htmlFor={`fac-${facility.id}`}
                                                >
                                                    {facility.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3 p-3 border rounded-4 bg-white">
                                <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                    Alte facilitati
                                </label>
                                <textarea
                                    name="otherFacilities"
                                    className="form-control shadow-none small setup-input-style"
                                    rows={3}
                                    value={formData.otherFacilities}
                                    onChange={handleInputChange}
                                    placeholder="Ex: terasa incalzita, meniu vegetarian, zona privata"
                                />
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark btn-sm px-4 py-2 text-uppercase font-monospace"
                                    onClick={() => setActiveTab('general')}
                                >
                                    Inapoi
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-dark btn-sm px-4 py-2 text-uppercase font-monospace"
                                    onClick={() => setActiveTab('location')}
                                >
                                    Inainte
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'location' && (
                        <div>
                            <div className="mb-4">
                                <h3 className="h6 fw-bold text-uppercase text-dark mb-1 section-title-style">
                                    Locatie
                                </h3>
                                <p className="text-muted small mb-0">
                                    Adauga adresa si coordonatele restaurantului pentru afisarea corecta pe harta.
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                    Adresa completa
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control shadow-none py-2 setup-input-style"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                        Latitudine
                                    </label>
                                    <input
                                        type="text"
                                        name="latitude"
                                        className="form-control shadow-none font-monospace py-2 setup-input-style"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase text-muted section-title-style">
                                        Longitudine
                                    </label>
                                    <input
                                        type="text"
                                        name="longitude"
                                        className="form-control shadow-none font-monospace py-2 setup-input-style"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark btn-sm px-4 py-2 text-uppercase font-monospace"
                                    onClick={() => setActiveTab('filters')}
                                >
                                    Inapoi
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-dark btn-sm px-4 py-2 text-uppercase font-monospace"
                                    onClick={() => setActiveTab('images')}
                                >
                                    Inainte
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div>
                            <div className="mb-4">
                                <h3 className="h6 fw-bold text-uppercase text-dark mb-1 section-title-style">
                                    Galerie foto
                                </h3>
                                <p className="text-muted small mb-0">
                                    Adauga imagini clare ale restaurantului. In editare poti pastra imaginile existente.
                                </p>
                            </div>

                            <div className="row g-3 mb-4">
                                {[1, 2, 3].map(index => {
                                    const previewKey = `image${index}` as 'image1' | 'image2' | 'image3';
                                    const fileKey = `imageFile${index}` as 'imageFile1' | 'imageFile2' | 'imageFile3';

                                    return (
                                        <div className="col-md-4" key={index}>
                                            <div className="border rounded-4 p-3 bg-white h-100">
                                                <div className="border rounded-3 bg-light d-flex align-items-center justify-content-center overflow-hidden mb-3 image-preview-box">
                                                    {previews[previewKey] ? (
                                                        <img
                                                            src={previews[previewKey]}
                                                            className="w-100 h-100 object-fit-cover"
                                                            alt={`Preview ${index}`}
                                                        />
                                                    ) : (
                                                        <span className="small text-muted">
                                                            Imagine {index}
                                                        </span>
                                                    )}
                                                </div>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, fileKey, previewKey)}
                                                    className="form-control form-control-sm shadow-none"
                                                    required={!isEditMode}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark btn-sm px-4 py-2 text-uppercase font-monospace"
                                    onClick={() => setActiveTab('location')}
                                >
                                    Inapoi
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-dark px-4 py-2 btn-sm text-uppercase font-monospace submit-profile-btn"
                                >
                                    Salveaza profilul
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
            <Footer />
        </div>
    );
};