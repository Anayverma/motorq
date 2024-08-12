import React from "react";
import Link from "next/link";
const Vehicles = () => {
  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-6xl font-bold mb-8">Vehicles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          href={"/vehicle/add"}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Add Vehicle
        </Link>
        <Link
          href={"/vehicle/get"}
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
        >
          Get Specific Vehicle
        </Link>
        <Link
          href={"/vehicle/decode"}
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Decode VIN
        </Link>
      </div>
    </div>
  );
};

export default Vehicles;
