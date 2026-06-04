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
    eventTypeId?: string | null;
    eventMenuType?: string | null;
    menuSelections?: CreateReservationMenuSelectionDto[];
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
    eventTypeName?: string | null;

    restaurantName: string;
    restaurantAddress: string;
    userEmail: string;

    estimatedTotalCost: number;
    hasReview: boolean;

    createdAt: string;
}

export interface EventTypeDto {
    id: string;
    code: string;
    name: string;
    description?: string | null;
}

export interface RestaurantEventOptionDto {
    id: string;
    eventTypeId: string;
    eventTypeCode: string;
    eventTypeName: string;
    isEnabled: boolean;
    pricePerPerson: number;
    minPeople: number;
    maxPeople?: number | null;
    details?: string | null;

    menuOptions: RestaurantEventMenuOptionDto[];
}

export interface RestaurantEventSettingsDto {
    acceptsEvents: boolean;
    eventOptions: RestaurantEventOptionDto[];
}

export interface UpdateRestaurantEventOptionDto {
    eventTypeId: string;
    isEnabled: boolean;
    pricePerPerson: number;
    minPeople: number;
    maxPeople?: number | null;
    details?: string | null;
}

export interface UpdateRestaurantEventsDto {
    acceptsEvents: boolean;
    eventOptions: UpdateRestaurantEventOptionDto[];
}

export interface RestaurantEventOptionPublicDto {
    eventTypeId: string;
    eventTypeCode: string;
    eventTypeName: string;
    pricePerPerson: number;
    minPeople: number;
    maxPeople?: number | null;
    details?: string | null;
    menuOptions: RestaurantEventMenuOptionPublicDto[];
}

export interface EventRestaurantListingDto {
    id: string;
    name: string;
    address: string;
    description: string;
    cityId: string;
    cityName: string;
    capacity: number;
    averageBudget: number;
    image1Url?: string | null;
    image2Url?: string | null;
    image3Url?: string | null;
    minEventPricePerPerson: number;
    eventOptions: RestaurantEventOptionPublicDto[];
}

export interface MenuTypeDto {
    id: string;
    code: string;
    name: string;
    description?: string | null;
}

export interface RestaurantEventMenuOptionDto {
    id: string;
    menuTypeId: string;
    menuTypeCode: string;
    menuTypeName: string;
    isEnabled: boolean;
    pricePerPerson: number;
    details?: string | null;
    menuOptions: RestaurantEventMenuOptionDto[];
}

export interface RestaurantEventMenuOptionPublicDto {
    id: string;
    menuTypeId: string;
    menuTypeCode: string;
    menuTypeName: string;
    pricePerPerson: number;
    details?: string | null;
    menuOptions: RestaurantEventMenuOptionPublicDto[];
}

export interface CreateReservationMenuSelectionDto {
    restaurantEventMenuOptionId: string;
    quantity: number;
}

export interface ReviewDto {
    id: string;
    reservationId: string;
    restaurantId: string;
    restaurantName: string;
    userFullName: string;
    userEmail: string;
    rating: number;
    comment?: string | null;
    type: string;
    reservationDate: string;
    createdAt: string;
    imageUrls: string[];
    isApproved: boolean;
}

export interface AdminUserDto {
    id: string;
    email: string;
    userName: string;
    hasProfileCompleted: boolean;
    roles: string[];
}

export interface AdminRestaurantDto {
    id: string;
    name: string;
    address: string;
    cityName: string;
    capacity: number;
    acceptsEvents: boolean;
    managerId: string;
}