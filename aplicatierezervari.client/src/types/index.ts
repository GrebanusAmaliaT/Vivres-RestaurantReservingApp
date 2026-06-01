export interface RestaurantDto {
    id: string;
    name: string;
    address: string;
    description: string;
    capacity: number;
    averageBudget: number;
    cityName: string;
    cuisineTypes: string[];
    facilities: string[];
}

export interface CityDto {
    id: string;
    name: string;
}

export interface UserContextType {
    token: string | null;
    role: 'Client' | 'RestaurantManager' | null;
    currentCityId: string | null;
    updateCity: (cityId: string) => void;
    logout: () => void;
}