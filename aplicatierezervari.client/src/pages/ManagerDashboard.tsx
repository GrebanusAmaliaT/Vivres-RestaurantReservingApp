import * as React from 'react';
import { useState } from 'react';

// Structura stricta a unei rezervari reale venite din baza de date (PostgreSQL)
interface ReservationRequest {
    id: number;
    clientName: string;
    clientPhone: string;
    numberOfPersons: number;
    date: string;  // Data evenimentului
    time: string;  // Ora ceruta
    eventType: 'table' | 'event'; // Rezervare simpla sau Eveniment special
    notes?: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface ManagerDashboardProps {
    restaurantName: string;
    // Cererile reale primite din backend
    reservations: ReservationRequest[];
    // Functii de interactiune cu backend-ul pentru a schimba statusul in baza de date
    onUpdateStatus: (id: number, newStatus: 'approved' | 'rejected') => void;
    // Actiune pentru butonul de editare profil (te trimite inapoi la wizard-ul de setup)
    onEditProfileClick: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
    restaurantName,
    reservations,
    onUpdateStatus,
    onEditProfileClick
}) => {
    // Filtram dinamic doar cererile care sunt "pending" pentru panoul principal
    const pendingRequests = reservations.filter(res => res.status === 'pending');

    return (
        <div className="container py-5 text-start" style={{ maxWidth: '1100px', color: '#1a1a1a' }}>

            {/* BANNER TOP: DETALII CONT RESTAURANT */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-4 mb-5 gap-3">
                <div>
                    <span className="text-uppercase font-monospace text-muted small tracking-wider">// Manager Control Panel</span>
                    <h1 className="h2 fw-bold m-0 mt-1">{restaurantName}</h1>
                </div>
                <div>
                    <button
                        onClick={onEditProfileClick}
                        className="btn btn-outline-dark font-monospace text-uppercase shadow-none"
                        style={{ fontSize: '12px', letterSpacing: '0.05em', borderRadius: '6px' }}
                    >
                        ⚙️ Editeaza Datele Profilului
                    </button>
                </div>
            </div>

            {/* STATISTICI RAPIDE */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="p-4 border rounded-4 bg-white shadow-sm">
                        <span className="text-muted font-monospace small text-uppercase d-block mb-1">Cereri in Asteptare</span>
                        <span className="display-6 fw-bold text-warning">{pendingRequests.length}</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 border rounded-4 bg-white shadow-sm">
                        <span className="text-muted font-monospace small text-uppercase d-block mb-1">Total Rezervari Istoric</span>
                        <span className="display-6 fw-bold">{reservations.length}</span>
                    </div>
                </div>
            </div>

            {/* SECTIUNEA DE GESTIONARE REZERVARI PENDING */}
            <div className="mb-4">
                <h2 className="h4 fw-bold mb-1">Cererile de Rezervare Primite</h2>
                <p className="text-muted small fw-light m-0">Aproba sau respinge cererile live trimise de utilizatori. Datele de mai jos reflecta realitatea din baza de date.</p>
            </div>

            {/* VALIDARE DINAMICA: DACA NU SUNT CERERI REALE */}
            {pendingRequests.length === 0 ? (
                <div className="border rounded-4 p-5 text-center bg-light my-4 text-muted font-monospace">
                    <span className="fs-3 d-block mb-2">📥</span>
                    No reservation requests at the moment
                </div>
            ) : (
                /* DACA EXISTA CERERI, LE LEGAM IN TABEL */
                <div className="table-responsive border rounded-4 shadow-sm bg-white overflow-hidden">
                    <table className="table table-hover align-middle m-0" style={{ minWidth: '800px' }}>
                        <thead className="table-dark font-monospace text-uppercase small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                            <tr>
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3">Tip Solicitare</th>
                                <th className="py-3 text-center">Numar Persoane</th>
                                <th className="py-3">Data & Ora Solicitata</th>
                                <th className="py-3">Mentiuni / Note</th>
                                <th className="py-3 text-end px-4">Actiuni Instant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map((request) => (
                                <tr key={request.id} style={{ borderBottom: '1px solid #f0f0f0' }}>

                                    {/* Informatii client */}
                                    <td className="py-3 px-4">
                                        <span className="fw-bold d-block">{request.clientName}</span>
                                        <span className="text-muted small font-monospace">{request.clientPhone}</span>
                                    </td>

                                    {/* Tip rezervare (Masa simpla sau Eveniment mare) */}
                                    <td className="py-3">
                                        {request.eventType === 'event' ? (
                                            <span className="badge bg-info text-dark text-uppercase font-monospace" style={{ fontSize: '10px' }}>Eveniment / Plan</span>
                                        ) : (
                                            <span className="badge bg-light text-dark border text-uppercase font-monospace" style={{ fontSize: '10px' }}>Rezervare Masa</span>
                                        )}
                                    </td>

                                    {/* Numar exact de persoane */}
                                    <td className="py-3 text-center fw-bold fs-5 text-dark">
                                        {request.numberOfPersons}
                                    </td>

                                    {/* Data si Ora */}
                                    <td className="py-3 font-monospace small">
                                        <span className="d-block fw-bold">{request.date}</span>
                                        <span className="text-muted">{request.time}</span>
                                    </td>

                                    {/* Notele clientului */}
                                    <td className="py-3 text-muted small fw-light" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {request.notes ? request.notes : <span className="text-muted-50 fst-italic">Fara mentiuni</span>}
                                    </td>

                                    {/* Butoane de actiune */}
                                    <td className="py-3 text-end px-4">
                                        <div className="d-inline-flex gap-2">
                                            <button
                                                onClick={() => onUpdateStatus(request.id, 'approved')}
                                                className="btn btn-success btn-sm px-3 font-monospace text-uppercase fw-bold shadow-none"
                                                style={{ fontSize: '10px', borderRadius: '4px' }}
                                            >
                                                Aproba ✓
                                            </button>
                                            <button
                                                onClick={() => onUpdateStatus(request.id, 'rejected')}
                                                className="btn btn-outline-danger btn-sm px-3 font-monospace text-uppercase fw-bold shadow-none"
                                                style={{ fontSize: '10px', borderRadius: '4px' }}
                                            >
                                                Respinge ✕
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};