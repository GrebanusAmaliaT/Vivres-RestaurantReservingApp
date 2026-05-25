# TableBooker - Advanced Restaurant Reservation System

(soon-to-be) enterprise-grade full-stack web application designed to streamline the restaurant discovery and table booking process. The system connects food enthusiasts with local dining venues, offering real-time availability management, dynamic filtering, and a secure multi-role ecosystem.

Built using a decoupled architecture with a high-performance **.NET 8 Web API** backend and a highly responsive **React (Vite) + TypeScript** frontend.

---

##  Architecture & Design Patterns

The backend follows a clean, maintainable architecture separation to ensure scalability and loose coupling:
- **Data Layer:** Managed via Entity Framework Core utilizing the **Repository Pattern** for database abstraction.
- **Service Layer:** Houses the core business logic, handling DTO mappings, validations, and custom exception handling.
- **Controller Layer:** Lightweight REST endpoints exposing secure APIs documented natively via Swagger/OpenAPI.
- **Security:** Strict separation of concerns using **JWT Bearer Authentication** and **ASP.NET Core Identity** for role-based security access control.

---

##  Core Features (Implemented)

###  1. Secure Authentication Ecosystem
- Full registration and login workflows handled via Identity framework.
- **JWT Token Issuance:** Secure stateless authentication with custom claims (Roles, User ID, Associated City).
- **Role-Based Access Control (RBAC):** Distinct permissions tailored for **Clients**, **Restaurant Managers**, and **Platform Admins**.

###  2. Dynamic Discovery & Advanced Filtering
- Categorization of all dining locations by geographical **Cities**.
- Multi-parametric filtering mechanism allowing users to combine:
  - Specific **Cuisine Types** (e.g., Italian, Traditional, Asian).
  - Essential **Amenities/Facilities** (e.g., Terrace, Parking, Pet Friendly, Kids Zone).
  - **Financial Brackets** via interactive maximum average budget filters.

###  3. Smart Reservation Engine
- Automated real-time reservation processing tracking total guest capacity.
- Support for custom customer inputs (Special requests, dietary notes, seating preferences).
- Dynamic cost estimation logic embedded inside backend service layers.
- Advanced state machine tracking reservation statuses (`Pending` ➡️ `Confirmed` / `Rejected`).

###  4. Enterprise Infrastructure
- **Global Exception Handling:** Custom production-ready middleware that intercepts all system errors and serializes them into standardized, safe client-side JSON messages (hiding stack traces in production).
- **Automated Data Seeding:** Complete database seeder initializing application roles, essential cities, and baseline configurations upon initial deployment.

---

##  Future Roadmap (Planned Features)

###  Google Maps Integration (Next Up)
- **Manager Panel:** An interactive map component allowing restaurant owners to drop a pin or use Google Places Autocomplete to save exact geometric coordinates (`Latitude` & `Longitude`).
- **Client View:** Embedding localized maps on the restaurant detail page featuring custom markers to guide users directly to the venue.

###  Manager Analytics Dashboard 
- Visual charts tracking reservation frequencies, peak dining hours, and monthly revenue metrics.
- Advanced table layout designer for live seating updates.

###  Community Feedback System
- Fully integrated rating and review framework permitting authenticated guests to leave structured text feedback and 1-5 star ratings after completing a reservation.

---

## Technical Specifications & Setup

### Prerequisites
- **Backend:** .NET 8.0 SDK / SQL Server Express or LocalDB
- **Frontend:** Node.js (v18+) & npm
