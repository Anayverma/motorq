"use client";
import React from "react";
import Link from "next/link";
const Organisation = () => {
  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-6xl font-bold mb-8">Organisation</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          href="/org/add"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Add Organisation
        </Link>
        <Link
          href="/org/get"
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
        >
          Get Organisation
        </Link>
        <Link
          href="/org/update"
          className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600 transition duration-300"
        >
          Update Organisation
        </Link>
      </div>
    </div>
  );
};

export default Organisation;
