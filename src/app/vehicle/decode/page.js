"use client";

import React, { useState } from "react";

const DecodeVin = () => {
  const [vin, setVin] = useState(""); // State to manage the VIN input
  const [decodedData, setDecodedData] = useState(null); // State to store the decoded VIN data
  const [message, setMessage] = useState(null); // State to manage the message
  const [messageType, setMessageType] = useState(""); // State to manage message type ('success' or 'error')

  const handleChange = (e) => {
    setVin(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/vehicles/decode?vin=${vin}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Invalid VIN or VIN not found');
      }

      const data = await response.json();
      // setDecodedData(data);
      setMessageType("success");
      setMessage("VIN decoded successfully!");

    } catch (error) {
      setMessageType("error");
      setMessage("There was an error decoding the VIN!");
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
        <h2 className="text-3xl font-bold mb-4">Decode VIN</h2>
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
     
    </div>
  );
};

export default DecodeVin;
