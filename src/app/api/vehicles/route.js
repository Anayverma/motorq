"use server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from 'next/server';

// Ensure the environment variable is correctly loaded
const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL;
if (!connectionString) {
    console.log("Connection string is not defined");
    throw new Error("DATABASE_URL is not defined in the environment variables.");
}

// Initialize the Neon client
const sql = neon(connectionString);

// Helper function to validate the VIN (17-character alphanumeric)
function isValidVin(vin) {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinRegex.test(vin);
}

// Helper function to ensure the vehicles table exists
async function ensureVehiclesTableExists() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS vehicles (
                id SERIAL PRIMARY KEY,
                vin VARCHAR(17) NOT NULL UNIQUE,
                org_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (org_name) REFERENCES organizations(name)
            );
        `;
    } catch (error) {
        console.error('Error creating vehicles table:', error);
        throw error;
    }
}

// Function to check if the organization exists
async function checkOrgExists(orgName) {
    const result = await sql`
        SELECT 1 FROM organizations WHERE name = ${orgName};
    `;
    return result.length > 0;
}

// POST Method: Adding a vehicle to the system
export async function POST(request) {
    try {
        const requestBody = await request.json();
        const { vin, orgName } = requestBody;

        // Validate VIN and organization
        if (!vin || !isValidVin(vin)) {
            return NextResponse.json({ error: 'Invalid VIN. It should be a 17-character alphanumeric string.' }, { status: 400 });
        }
        if (!orgName) {
            return NextResponse.json({ error: 'Organization name is required.' }, { status: 400 });
        }

        // Ensure the vehicles table exists
        await ensureVehiclesTableExists();

        // Check if the organization exists
        const orgExists = await checkOrgExists(orgName);
        if (!orgExists) {
            return NextResponse.json({ error: 'Organization name does not exist.' }, { status: 400 });
        }

        // Insert the vehicle into the database
        await sql`
            INSERT INTO vehicles (vin, org_name)
            VALUES (${vin}, ${orgName});
        `;

        return NextResponse.json({ message: 'Vehicle added successfully', vin, orgName }, { status: 201 });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return NextResponse.json({ error: 'Failed to add vehicle', details: error.message }, { status: 500 });
    }
}

// GET Method: Retrieve all vehicles
export async function GET() {
    try {
        // Ensure the vehicles table exists
        await ensureVehiclesTableExists();

        // Retrieve all vehicles from the database
        const vehicles = await sql`
            SELECT * FROM vehicles;
        `;

        return NextResponse.json(vehicles, { status: 200 });
    } catch (error) {
        console.error('Error retrieving vehicles:', error);
        return NextResponse.json({ error: 'Failed to retrieve vehicles', details: error.message }, { status: 500 });
    }
}
