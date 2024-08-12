import { NextResponse } from 'next/server';

// Define the API route handler
export async function GET(request) {
    // Extract the VIN from the query parameters
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get('vin');

    // Validate the VIN
    if (!vin || vin.length !== 17) {
        console.log(vin)
        return NextResponse.json({ error: 'A valid 17-character VIN is required' }, { status: 400 });
    }

    // Construct the API URL
    const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;

    try {
        // Fetch data from the NHTSA API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Return the JSON response
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
