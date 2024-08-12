"use client";
import React, { useState } from 'react';

const AddVehicle = () => {
  const [vin, setVin] = useState('');
  const [orgName, setOrgName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin, orgName }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Failed to add vehicle');
    }
  };

  return (
    <div>
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>VIN:</label>
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Organization Name:</label>
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Vehicle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddVehicle;
