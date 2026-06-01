import { RestaurantDto, CityDto } from '../types/index';

const API_BASE_URL = 'https://localhost:7065/api'; 
export const apiService = {
   
    async getCities(): Promise<CityDto[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/Cities`);
            if (!response.ok) throw new Error('Failed to load cities');
            return await response.json();
        } catch (error) {
            console.error('API Error in getCities:', error);
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
            const queryParams = new URLSearchParams({ cityId });

            if (cuisineTypeId) queryParams.append('cuisineTypeId', cuisineTypeId);
            if (maxBudget) queryParams.append('maxBudget', maxBudget.toString());
            if (facilityId) queryParams.append('facilityId', facilityId);

           
            const token = localStorage.getItem('vivres_auth_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/restaurants?${queryParams.toString()}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) throw new Error('Failed to load restaurants');
            return await response.json();
        } catch (error) {
            console.error('API Error in getFilteredRestaurants:', error);
            return [];
        }
    }
};