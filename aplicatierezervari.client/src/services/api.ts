import { RestaurantDto, CityDto, CreateReservationDto, ReservationDto} from '../types/index';

const API_BASE_URL = 'https://localhost:7065/api';

export interface CatalogItemDto {
    id: string;
    name: string;
}
const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('vivres_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

export const apiService = {
    async getCities(): Promise<CityDto[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/Cities`);

            if (!response.ok) {
                throw new Error('Failed to load cities');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error in getCities:', error);
            return [];
        }
    },

    async getCuisines(): Promise<CatalogItemDto[]> {
        try {
            const token = localStorage.getItem('vivres_token');

            const response = await fetch(`${API_BASE_URL}/Restaurants/cuisines`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load cuisines');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error in getCuisines:', error);
            return [];
        }
    },

    async getFacilities(): Promise<CatalogItemDto[]> {
        try {
            const token = localStorage.getItem('vivres_token');

            const response = await fetch(`${API_BASE_URL}/Restaurants/facilities`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load facilities');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error in getFacilities:', error);
            return [];
        }
    },

    async getFilteredRestaurants(
        cityId: string,
        cuisineTypeId?: string,
        maxBudget?: number,
        facilityId?: string
    ): Promise<RestaurantDto[]> {
        try {
            const queryParams = new URLSearchParams();

            queryParams.append('cityId', cityId);

            if (cuisineTypeId) {
                queryParams.append('cuisineTypeId', cuisineTypeId);
            }

            if (maxBudget && maxBudget > 0) {
                queryParams.append('maxBudget', maxBudget.toString());
            }

            if (facilityId) {
                queryParams.append('facilityId', facilityId);
            }

            const token = localStorage.getItem('vivres_token');

            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(
                `${API_BASE_URL}/Restaurants?${queryParams.toString()}`,
                {
                    method: 'GET',
                    headers
                }
            );

            if (!response.ok) {
                throw new Error('Failed to load restaurants');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error in getFilteredRestaurants:', error);
            return [];
        }
    },

     async createReservation(data: CreateReservationDto): Promise<ReservationDto> {
        const response = await fetch(`${API_BASE_URL}/Reservations`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        const responseText = await response.text();

        if (!response.ok) {
            console.error('Create reservation error:', responseText);
            throw new Error(responseText || 'Failed to create reservation');
        }

        const parsed = responseText ? JSON.parse(responseText) : null;

        return parsed.reservation;
    },

    async getClientReservations(): Promise<ReservationDto[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/Reservations/client-history`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load client reservations');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error in getClientReservations:', error);
            return [];
        }
    },


    async getManagerReservations(): Promise<ReservationDto[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/Reservations/manager-dashboard`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Manager reservations error:', errorText);
                throw new Error(errorText || 'Failed to load manager reservations');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error in getManagerReservations:', error);
            return [];
        }
    },

    async updateReservationStatus(
        reservationId: string,
        status: 'Confirmed' | 'Rejected'
    ): Promise<void> {
        const response = await fetch(
            `${API_BASE_URL}/Reservations/${reservationId}/status?status=${status}`,
            {
                method: 'PUT',
                headers: getAuthHeaders()
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update reservation status error:', errorText);
            throw new Error(errorText || 'Failed to update reservation status');
        }
    }

};