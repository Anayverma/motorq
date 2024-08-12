# More Torque- MotorQ Vehicle and Organization Management

This project is a Next.js application designed for managing vehicle and organization data. It provides API routes for creating, retrieving, and updating information related to vehicles and organizations. The application uses a serverless PostgreSQL database managed via a Neon instance.

- Tutorial Video: [Watch on Loom](https://www.loom.com/share/2b6f1fa1c3d04dfca09aa9dd5de01a41?sid=e1a87807-2d29-4347-b414-2a898cbd33d0)
- Code Explanation Video: [Watch on Loom](https://www.loom.com/share/ddf28afc35a84c9d936d9f8f8244b78c)


## Table of Contents
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Client Pages](#client-pages)
- [Database Setup](#database-setup)
- [Additional Resources](#additional-resources)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/motorq.git
   cd motorq
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variable:

```plaintext
NEXT_PUBLIC_DATABASE_URL=your-neon-database-url
```

Replace `your-neon-database-url` with the actual URL for your Neon PostgreSQL database.

## Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## API Endpoints

### Organizations

- **POST /api/orgs**: Create a new organization.
  - Request Body:
    ```json
    {
      "name": "Organization Name",
      "account": "Account ID",
      "website": "https://example.com",
      "fuelReimbursementPolicy": "1000",
      "speedLimitPolicy": "80",
      "parentName": "Parent Organization Name"
    }
    ```
  - Response: Returns the created organization details.

- **PATCH /api/orgs**: Update the fuel reimbursement policy for an organization.
  - Request Body:
    ```json
    {
      "name": "Organization Name",
      "fuelReimbursementPolicy": "1100"
    }
    ```
  - Response: Updates the policy for the specified organization.

- **GET /api/orgs**: Retrieve all organizations.

### Vehicles

- **POST /api/vehicles**: Add a new vehicle to the system.
  - Request Body:
    ```json
    {
      "vin": "1HGCM82633A004352",
      "orgName": "Organization Name"
    }
    ```
  - Response: Adds the vehicle to the specified organization.

- **GET /api/vehicles/decode**: Decode vehicle information using a VIN.
  - Query Parameters: `vin` (17-character VIN)
  - Response: Returns decoded vehicle details from the NHTSA API.

## Client Pages

### Organization Management
- Add Organization: `/org/add` - Form to create a new organization.
- View Organizations: `/org` - View all organizations.
- Update Organization: `/org/update` - Update fuel reimbursement policy.

### Vehicle Management
- Add Vehicle: `/vehicle/add` - Form to add a new vehicle.
- Decode Vehicle: `/vehicle/decode` - Decode vehicle details using a VIN.
- View Vehicles: `/vehicle` - View all vehicles.

## Database Setup

This application uses a PostgreSQL database. The database schema is automatically created when you run the API for the first time. The schema includes the following tables:

### organizations

| Column | Type | Description |
|--------|------|-------------|
| name | VARCHAR(255) | Primary key, name of the organization |
| account | VARCHAR(255) | Account identifier |
| website | VARCHAR(255) | Organization's website URL |
| fuel_reimbursement_policy | VARCHAR(255) | Fuel reimbursement policy (default: '1000') |
| speed_limit_policy | VARCHAR(255) | Speed limit policy |
| parent_org_name | VARCHAR(255) | Parent organization name, foreign key |

### vehicles

| Column | Type | Description |
|--------|------|-------------|
| vin | VARCHAR(17) | Primary key, Vehicle Identification Number |
| org_name | VARCHAR(255) | Organization associated with the vehicle, foreign key |


## Additional Resources

- Tutorial Video: [Watch on Loom](https://www.loom.com/share/2b6f1fa1c3d04dfca09aa9dd5de01a41?sid=e1a87807-2d29-4347-b414-2a898cbd33d0)
- Code Explanation Video: [Watch on Loom](https://www.loom.com/share/ddf28afc35a84c9d936d9f8f8244b78c)

Thank you for the opportunity to work on this assignment. I look forward to your feedback.
