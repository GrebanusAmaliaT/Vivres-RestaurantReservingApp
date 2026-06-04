# Vivres

Vivres is a full-stack restaurant reservation web application built with **ASP.NET Core Web API** and **React + TypeScript**.

The platform allows users to browse restaurants, create table reservations, request event reservations, leave reviews, and manage their booking history. Restaurants can manage their own profile, reservations, event options and menus, while an admin can moderate users and reviews.

## Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- ASP.NET Core Identity
- JWT Authentication
- Repository Pattern
- Service Layer
- DTOs
- Global Exception Middleware

### Frontend
- React
- TypeScript
- Vite
- Bootstrap
- Custom CSS
- Fetch API

## Main Features

### Client
- Register and login
- Browse restaurants by city and filters
- Make table reservations
- Send event reservation requests
- View personal reservations by status
- Leave reviews after completed reservations
- Upload images with reviews
- View and delete own reviews

### Restaurant Manager
- Create and edit restaurant profile
- Manage table reservation requests
- Accept or reject reservations
- Configure event reservation options
- Set event menu types and prices
- Manage event requests separately

### Admin
- View all users
- View all restaurants
- Delete client accounts
- Approve or reject pending reviews
- Access admin-only endpoints

## Roles

The application uses role-based authorization:

- `Client`
- `RestaurantManager`
- `Admin`

## Project Structure

```txt
AplicatieRezervari
│
├── AplicatieRezervari.Client
│   └── React + TypeScript frontend
│
└── AplicatieRezervari.Server
    └── ASP.NET Core Web API backend
```

## Project Structure

| Part | Folder / File | Purpose |
|---|---|---|
| Backend | `Controllers/` | API controllers and endpoint definitions |
| Backend | `DTOs/` | Data Transfer Objects used between backend and frontend |
| Backend | `Models/` | Entity Framework Core database models |
| Backend | `Services/` | Business logic layer |
| Backend | `Repositories/` | Data access layer |
| Backend | `Data/` | Database context and seed data |
| Backend | `Middleware/` | Global exception handling middleware |
| Backend | `Migrations/` | Entity Framework Core migrations |
| Frontend | `src/components/` | Reusable UI components |
| Frontend | `src/pages/admin/` | Admin dashboard pages |
| Frontend | `src/pages/Auth/` | Login and register pages |
| Frontend | `src/pages/client/` | Client-facing pages for restaurants, reservations and reviews |
| Frontend | `src/pages/manager/` | Restaurant manager pages |
| Frontend | `src/services/` | API communication layer |
| Frontend | `src/types/` | TypeScript interfaces and shared types |
| Frontend | `src/context/` | Shared frontend context/state |

## Database

The application uses Entity Framework Core with SQL Server.

### Main entities include:

- ApplicationUser
- Restaurant
- RestaurantTable
- Reservation
- Review
- ReviewImage
- City
- CuisineType
- Facility
- EventType
- MenuType
- RestaurantEventOption
- RestaurantEventMenuOption

The database includes both one-to-many and many-to-many relationships.

## Review Flow

### Reviews are not published immediately.

- Client submits review
- Admin approves review
- Review becomes visible on the restaurant page

If the admin rejects the review, it is deleted.

### How to Run
-> Backend
cd AplicatieRezervari.Server
dotnet restore
dotnet ef database update
dotnet run
-> Frontend
cd AplicatieRezervari.Client
npm install
npm run dev
Admin Account

The admin account is created from configuration values, not hardcoded credentials.

### For local development:

dotnet user-secrets init
dotnet user-secrets set "SeedAdmin:Email" "admin@vivres.ro"
dotnet user-secrets set "SeedAdmin:Password" "Admin123!"
API Examples
Auth
POST /api/Auth/register
POST /api/Auth/login
Restaurants
GET /api/Restaurants
GET /api/Restaurants/{id}
POST /api/Restaurants/setup
GET /api/Restaurants/my-restaurant
Reservations
POST /api/Reservations
GET /api/Reservations/my
PUT /api/Reservations/{id}/status
Reviews
POST /api/Review
GET /api/Review/restaurant/{restaurantId}
GET /api/Review/my-reviews
DELETE /api/Review/{id}
Admin
GET /api/Admin/users
GET /api/Admin/restaurants
GET /api/Admin/reviews/pending
PUT /api/Admin/reviews/{reviewId}/approve
DELETE /api/Admin/reviews/{reviewId}/reject
DELETE /api/Admin/users/{userId}
## Screenshots

### Landing page

<p align="center">
  <img src="https://github.com/user-attachments/assets/e85533f1-a7b2-4555-9f50-6b92f94da374" width="850" alt="Landing page hero" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/e3045459-d01e-4767-9bd0-1131382f6efd" width="650" alt="Landing page section" />
</p>

---

### Restaurant listing

<p align="center">
  <img src="https://github.com/user-attachments/assets/e04c1790-bab7-4a69-a0ec-72af65d0fd0f" width="700" alt="Restaurant listing page" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/caa54a4a-1dfb-44c2-92fb-35caaf4660dd" width="700" alt="Restaurant listing filters" />
</p>

---

### Reservation form

<p align="center">
  <img src="https://github.com/user-attachments/assets/a88c3fb0-1faf-423d-814e-663c813a8aa3" width="750" alt="Reservation form" />
</p>

---

### Event restaurant page

<p align="center">
  <img src="https://github.com/user-attachments/assets/79afc6e2-f46e-43df-bf44-2181df7a7feb" width="750" alt="Event restaurant page" />
</p>

---

### Manager dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/6a78e3b4-3b54-42a1-ada7-52c19d998a95" width="850" alt="Manager dashboard" />
</p>

---

### Admin dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/457baa07-176c-4650-85dc-8cd27c354d06" width="800" alt="Admin dashboard" />
</p>

---

### My reservations

<p align="center">
  <img src="https://github.com/user-attachments/assets/017745d9-b282-4c21-845b-b04f39429f27" width="750" alt="My reservations page" />
</p>

---

### My reviews

<p align="center">
  <img src="https://github.com/user-attachments/assets/e0062ac8-0302-494f-a244-18cf0b27b7f5" width="750" alt="My reviews page" />
</p>
