import * as React from 'react';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { authService } from '../../services/authService';

export interface CityDto {
    id: string;
    name: string;
}

export interface AuthPageProps {
    onAuthSuccess: (role: string, hasProfileCompleted?: boolean) => void;
    onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBack }) => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [role, setRole] = useState<string>('Client');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');

    const [selectedCityId, setSelectedCityId] = useState<string>('');
    const [cities, setCities] = useState<CityDto[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        async function loadCities() {
            try {
                const data = await apiService.getCities();
                setCities(data);

                if (data.length > 0) {
                    setSelectedCityId(data[0].id);
                }
            } catch (err) {
                console.error('Nu s-au putut incarca orasele din baza de date', err);
            }
        }

        loadCities();
    }, []);

    const saveCityInLocalStorage = (cityId: string) => {
        localStorage.setItem('vivres_city_id', cityId);

        const city = cities.find(c => c.id === cityId);
        if (city) {
            localStorage.setItem('vivres_city', city.name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (isLogin) {
                const response = await authService.login({ email, password });
                console.log("LOGIN RESPONSE:", response);

                localStorage.setItem('vivres_token', response.token);
                localStorage.setItem('vivres_role', response.role);

                if (response.cityId) {
                    saveCityInLocalStorage(response.cityId);
                }

                const hasProfileCompleted =
                    response.hasProfileCompleted ??
                    response.HasProfileCompleted ??
                    false;

                localStorage.setItem('vivres_has_profile', String(hasProfileCompleted));

                if (response.cityId) {
                    localStorage.setItem('vivres_city_id', response.cityId);

                    const userCity = cities.find(c => c.id === response.cityId);
                    if (userCity) {
                        localStorage.setItem('vivres_city', userCity.name);
                    }

                }
                onAuthSuccess(response.role, hasProfileCompleted);
            } else {
                if (role === 'RestaurantManager' && !selectedCityId) {
                    setError('Selecteaza un oras pentru contul de restaurant.');
                    return;
                }

                await authService.register({
                    email,
                    password,
                    fullName,
                    role,
                    cityId: role === 'RestaurantManager' ? selectedCityId : undefined
                });

                if (role === 'RestaurantManager') {
                    saveCityInLocalStorage(selectedCityId);
                }

                setIsLogin(true);
                alert('Contul a fost creat cu succes! Te poti autentifica acum.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'A aparut o eroare la conectarea cu baza de date.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="container d-flex flex-column align-items-center justify-content-center min-vh-screen p-4"
            style={{ backgroundColor: '#ffffff' }}
        >
            <button
                className="btn btn-link text-decoration-none font-monospace small mb-4 text-secondary align-self-start shadow-none"
                onClick={onBack}
                style={{ fontSize: '13px' }}
            >
                &larr; Inapoi la Pagina Principala
            </button>

            <div
                className="p-4 p-md-5 rounded-4 shadow-sm w-100"
                style={{
                    maxWidth: '440px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e0e0e0'
                }}
            >
                <div className="text-center mb-4">
                    <h2
                        className="fw-bold text-dark h4 tracking-wide text-uppercase"
                        style={{ letterSpacing: '0.1em' }}
                    >
                        Vivres
                    </h2>
                    <h3 className="h6 fw-bold text-secondary mt-2">
                        {isLogin ? 'Autentificare Cont' : 'Creare Cont Nou'}
                    </h3>
                </div>

                {error && (
                    <div
                        className="alert alert-danger p-2 small text-center font-monospace"
                        style={{ borderRadius: '6px' }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-3 text-start">
                            <label
                                className="form-label small fw-bold text-secondary text-uppercase font-monospace"
                                style={{ fontSize: '11px' }}
                            >
                                Nume Complet
                            </label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="form-control bg-white shadow-none"
                                style={{ borderRadius: '6px', border: '1px solid #cccccc' }}
                                placeholder="Ex: Ion Popescu"
                            />
                        </div>
                    )}

                    <div className="mb-3 text-start">
                        <label
                            className="form-label small fw-bold text-secondary text-uppercase font-monospace"
                            style={{ fontSize: '11px' }}
                        >
                            Adresa de Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control bg-white shadow-none"
                            style={{ borderRadius: '6px', border: '1px solid #cccccc' }}
                            placeholder="nume@exemplu.com"
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label
                            className="form-label small fw-bold text-secondary text-uppercase font-monospace"
                            style={{ fontSize: '11px' }}
                        >
                            Parola
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control bg-white shadow-none"
                            style={{ borderRadius: '6px', border: '1px solid #cccccc' }}
                            placeholder="••••••••"
                        />
                    </div>

                    {!isLogin && (
                        <div className="mb-3 text-start">
                            <label
                                className="form-label small fw-bold text-secondary text-uppercase font-monospace"
                                style={{ fontSize: '11px' }}
                            >
                                Tip Cont
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="form-select bg-white shadow-none"
                                style={{ borderRadius: '6px', border: '1px solid #cccccc' }}
                            >
                                <option value="Client">Client (Utilizator)</option>
                                <option value="RestaurantManager">Restaurant Manager</option>
                            </select>
                        </div>
                    )}

                    {!isLogin && role === 'RestaurantManager' && (
                        <div className="mb-3 text-start p-3 bg-white rounded border border-light-subtle">
                            <label
                                className="form-label small fw-bold text-dark text-uppercase font-monospace"
                                style={{ fontSize: '11px' }}
                            >
                                Oras Operational Manager
                            </label>

                            <select
                                value={selectedCityId}
                                onChange={(e) => setSelectedCityId(e.target.value)}
                                className="form-select form-select-sm shadow-none"
                                required
                            >
                                {cities.length === 0 ? (
                                    <option value="">Se incarca orasele...</option>
                                ) : (
                                    cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-dark w-100 py-2 fw-bold text-uppercase tracking-wider small mt-3 shadow-none"
                        style={{ borderRadius: '6px', fontSize: '13px' }}
                    >
                        {isSubmitting
                            ? 'Se incarca...'
                            : isLogin
                                ? 'Intra in Cont'
                                : 'Inregistreaza-te'}
                    </button>
                </form>

                <button
                    className="btn btn-link w-100 text-decoration-none small text-center text-secondary mt-4 font-monospace shadow-none"
                    style={{ fontSize: '12px' }}
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError(null);
                    }}
                >
                    {isLogin ? 'Nu ai cont? Inregistreaza-te' : 'Ai deja cont? Autentifica-te'}
                </button>
            </div>
        </div>
    );
};