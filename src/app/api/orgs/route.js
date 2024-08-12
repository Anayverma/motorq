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

// Helper function to ensure the organizations table exists
async function ensureOrganizationsTableExists() {
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
    } catch (error) {
        console.error('Error creating organizations table:', error);
        throw error;
    }
}

// POST Method: Creating a new organization
export async function POST(request) {
    try {
        const requestBody = await request.json();
        const { name, account, website, fuelReimbursementPolicy, speedLimitPolicy } = requestBody;

        // Validate the request body
        if (!name || !account) {
            return NextResponse.json({ error: 'Name and account are required.' }, { status: 400 });
        }

        // Ensure the organizations table exists
        await ensureOrganizationsTableExists();

        // Insert the new organization into the database
        await sql`
            INSERT INTO organizations (name, account, website, fuel_reimbursement_policy, speed_limit_policy)
            VALUES (${name}, ${account}, ${website}, ${fuelReimbursementPolicy || '1000'}, ${speedLimitPolicy})
            ON CONFLICT (name) DO NOTHING;
        `;

        return NextResponse.json({ message: 'Organization created successfully', name, account, website, fuelReimbursementPolicy, speedLimitPolicy }, { status: 201 });
    } catch (error) {
        console.error('Error creating organization:', error);
        return NextResponse.json({ error: 'Failed to create organization', details: error.message }, { status: 500 });
    }
}
