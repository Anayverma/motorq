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

// Function to ensure the organizations and vehicles tables exist
async function ensureTablesExist() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS organizations (
                name VARCHAR(255) PRIMARY KEY,
                account VARCHAR(255) NOT NULL,
                website VARCHAR(255),
                fuel_reimbursement_policy VARCHAR(255) DEFAULT '1000',
                speed_limit_policy VARCHAR(255)
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS vehicles (
                vin VARCHAR(17) PRIMARY KEY,
                org_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (org_name) REFERENCES organizations(name)
            );
        `;
    } catch (error) {
        console.error('Error creating tables:', error);
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

        // Ensure the organizations and vehicles tables exist
        await ensureTablesExist();

        // Check if the organization exists
        const orgExists = await checkOrgExists(orgName);
        if (!orgExists) {
            return NextResponse.json({ error: 'Organization name does not exist.' }, { status: 400 });
        }

        // Check if the VIN already exists
        const existingVehicle = await sql`
            SELECT * FROM vehicles WHERE vin = ${vin};
        `;
        if (existingVehicle.length > 0) {
            return NextResponse.json({ error: 'Vehicle with this VIN already exists.' }, { status: 409 });
        }

        // Insert the vehicle into the database
        await sql`
            INSERT INTO vehicles (vin, org_name)
            VALUES (${vin}, ${orgName});
        `;

        return NextResponse.json({ message: 'Vehicle added successfully', vin, orgName }, { status: 201 });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return NextResponse.json({ error: 'Failed to add vehicle' }, { status: 500 });
    }
}

// GET Method: Fetch a vehicle by VIN
export async function GET(request) {
    try {
        // Extract VIN from query parameters
        const { searchParams } = new URL(request.url);
        const vin = searchParams.get('vin');

        // Validate the VIN
        if (!vin || !isValidVin(vin)) {
            return NextResponse.json({ error: 'Invalid VIN. It should be a 17-character alphanumeric string.' }, { status: 400 });
        }

        // Ensure the vehicles table exists
        await ensureTablesExist();

        // Retrieve the vehicle by VIN
        const vehicle = await sql`
            SELECT * FROM vehicles WHERE vin = ${vin};
        `;

        if (vehicle.length === 0) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        return NextResponse.json(vehicle[0], { status: 200 });
    } catch (error) {
        console.error('Error retrieving vehicle:', error);
        return NextResponse.json({ error: 'Failed to retrieve vehicle' }, { status: 500 });
    }
}
