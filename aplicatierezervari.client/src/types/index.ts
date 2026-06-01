export interface CityDto {
    id: string;
    name: string;
}
export interface CatalogItemDto {
    id: string;
    name: string;
}
export interface RestaurantDto {
    id: string;
    name: string;
    address: string;
    description: string;
    capacity: number;
    averageBudget: number;

    cityId: string;
    cityName: string;

    latitude?: number;
    longitude?: number;

    mood: number;

    cuisineTypeIds: string[];
    cuisineTypes?: string[];

    standardFacilities: string[];
    otherFacilities: string;

    image1Url?: string;
    image2Url?: string;
    image3Url?: string;

    openingTime: string;
    closingTime: string;
    defaultReservationDurationInHours: number;
}

export interface CreateReservationDto {
    restaurantId: string;
    reservationDate: string;
    numberOfPeople: number;
    specialRequests?: string;
    isEvent: boolean;
    eventMenuType?: string | null;
}

export interface ReservationDto {
    id: string;
    restaurantId: string;
    restaurantTableId?: string | null;

    reservationDate: string;
    numberOfPeople: number;
    specialRequests?: string | null;

    status: string;
    type: string;
    eventMenuType?: string | null;

    restaurantName: string;
    restaurantAddress: string;
    userEmail: string;

    estimatedTotalCost: number;
    createdAt: string;
}
