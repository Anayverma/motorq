"use server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from 'next/server';

// Ensure the environment variable is correctly loaded
const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL;
if (!connectionString) {
    console.log("Connection string is not defined");
    throw new Error("DATABASE_URL is not defined in the environment variables.");
}

const sql = neon(connectionString);

async function ensureOrganizationsTableExists() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS organizations (
                name VARCHAR(255) PRIMARY KEY,
                account VARCHAR(255) NOT NULL,
                website VARCHAR(255),
                fuel_reimbursement_policy VARCHAR(255) DEFAULT '1000',
                speed_limit_policy VARCHAR(255),
                parent_org_name VARCHAR(255),
                FOREIGN KEY (parent_org_name) REFERENCES organizations(name) ON DELETE SET NULL
            );
        `;
    } catch (error) {
        console.error('Error creating organizations table:', error);
        throw error;
    }
}

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const { name, account, website, fuelReimbursementPolicy, speedLimitPolicy, parentName } = requestBody;
        console.log(name, account, website, fuelReimbursementPolicy, speedLimitPolicy, parentName )
        // Validate the request body
        if (!name || !account) {
            return NextResponse.json({ error: 'Name and account are required.' }, { status: 400 });
        }

        // Ensure the organizations table exists
        await ensureOrganizationsTableExists();

        let parentOrgName = null;
        let inheritedFuelReimbursementPolicy = fuelReimbursementPolicy || '1000';
        let inheritedSpeedLimitPolicy = speedLimitPolicy;

        if (parentName !== null) {
            // Query to check if the parent organization exists
            const parentOrgResult = await sql`
                SELECT name, fuel_reimbursement_policy, speed_limit_policy
                FROM organizations
                WHERE name = ${parentName};
            `;

            // Check if parent organization was found
            if (parentOrgResult.length === 0) {
                // If parent organization is not found, set the current organization as its own parent
                parentOrgName = name;
                inheritedFuelReimbursementPolicy = fuelReimbursementPolicy || '1000';
                inheritedSpeedLimitPolicy = speedLimitPolicy;
            } else {
                // Set parent organization details
                const parentOrg = parentOrgResult[0];
                parentOrgName = parentOrg.name;
                inheritedFuelReimbursementPolicy = parentOrg.fuel_reimbursement_policy;
                if (!speedLimitPolicy) {
                    inheritedSpeedLimitPolicy = parentOrg.speed_limit_policy;
                }
            }
        } else {
            // If no parentName provided, set the current organization as its own parent
            parentOrgName = name;
        }

        // Insert the new organization into the database
        await sql`
            INSERT INTO organizations (name, account, website, fuel_reimbursement_policy, speed_limit_policy, parent_org_name)
            VALUES (${name}, ${account}, ${website}, ${inheritedFuelReimbursementPolicy}, ${inheritedSpeedLimitPolicy}, ${parentOrgName})
            ON CONFLICT (name) DO NOTHING;
        `;

        return NextResponse.json({
            message: 'Organization created successfully',
            name,
            account,
            website,
            fuelReimbursementPolicy: inheritedFuelReimbursementPolicy,
            speedLimitPolicy: inheritedSpeedLimitPolicy,
            parentOrgName
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating organization:', error);
        return NextResponse.json({ error: 'Failed to create organization', details: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const requestBody = await request.json();
        const { name, fuelReimbursementPolicy } = requestBody;

        // Validate the request body
        if (!name || !fuelReimbursementPolicy) {
            return NextResponse.json({ error: 'Name and fuel reimbursement policy are required.' }, { status: 400 });
        }

        // Check if the organization exists and retrieve its details
        const orgResult = await sql`
            SELECT name, parent_org_name
            FROM organizations
            WHERE name = ${name};
        `;

        if (orgResult.length === 0) {
            return NextResponse.json({ error: 'Organization not found.' }, { status: 404 });
        }

        const org = orgResult[0];
        const orgName = org.name;
        const parentOrgName = org.parent_org_name;

        // Allow update if the parent organization is either null or the same as the organization being updated
        if (parentOrgName !== null && parentOrgName !== orgName) {
            return NextResponse.json({
                error: 'Cannot update fuel reimbursement policy. This organization is not an absolute parent.',
            }, { status: 400 });
        }

        // Update the fuel reimbursement policy for the organization and all its children
        await sql`
            UPDATE organizations
            SET fuel_reimbursement_policy = ${fuelReimbursementPolicy}
            WHERE name = ${orgName}
            OR parent_org_name = ${orgName};
        `;

        return NextResponse.json({
            message: 'Fuel reimbursement policy updated successfully',
            name,
            fuelReimbursementPolicy
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating fuel reimbursement policy:', error);
        return NextResponse.json({ error: 'Failed to update fuel reimbursement policy', details: error.message }, { status: 500 });
    }
}


// GET Method: Retrieve all organizations
export async function GET() {
    try {
        // Ensure the organizations table exists
        await ensureOrganizationsTableExists();

        // Retrieve all organizations from the database
        const organizations = await sql`
            SELECT * FROM organizations;
        `;

        return NextResponse.json(organizations, { status: 200 });
    } catch (error) {
        console.error('Error retrieving organizations:', error);
        return NextResponse.json({ error: 'Failed to retrieve organizations', details: error.message }, { status: 500 });
    }
}
