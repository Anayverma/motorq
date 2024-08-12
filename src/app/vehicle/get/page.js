"use client";

import React, { useState } from "react";

const GetVehicle = () => {
  const [vin, setVin] = useState(""); // State to manage the VIN input
  const [vehicle, setVehicle] = useState(null); // State to store the fetched vehicle details
  const [message, setMessage] = useState(null); // State to manage the message
  const [messageType, setMessageType] = useState(""); // State to manage message type ('success' or 'error')

  const handleChange = (e) => {
    setVin(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/vehicles?vin=${vin}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Vehicle not found');
      }

      const data = await response.json();
      setVehicle(data);
      setMessageType("success");
      setMessage("Vehicle fetched successfully!");

    } catch (error) {
      setMessageType("error");
      setMessage("There was an error fetching the vehicle!");
    } finally {
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage(null);
        setMessageType(""); // Reset message type
      }, 3000);
    }
  };

  return (
    <div>
      {message && (
        <div
          className={`${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white font-semibold py-2 px-4 rounded mb-4`}
        >
          {message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md mt-6"
      >
        <h2 className="text-3xl font-bold mb-4">Get Vehicle</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-xl">VIN:</label>
          <input
            type="text"
            name="vin"
            value={vin}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
      {vehicle && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Vehicle Details:</h3>
          <p><strong>VIN:</strong> {vehicle.vin}</p>
          <p><strong>Organization Name:</strong> {vehicle.org_name}</p>
          <p><strong>Created At:</strong> {new Date(vehicle.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default GetVehicle;
