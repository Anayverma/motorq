"use client";
import React from "react";
// import { Link } from "next/L";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-500">More Torque!
</div>
        <div className="space-x-4">
          <Link
            href={"/"}
            className="text-white text-lg hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition duration-300"
          >
            Vehicles
          </Link>
          <Link
            href={"/org"}
            className="text-white text-lg hover:bg-orange-500 hover:text-white px-4 py-2 rounded transition duration-300"
          >
            Organisation
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
