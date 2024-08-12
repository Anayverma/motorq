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
        setVin('');
        setOrgName('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Failed to add vehicle');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Add Vehicle</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vin" className="form-label">VIN:</label>
          <input
            type="text"
            id="vin"
            className="form-input"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            required
            placeholder="Enter 17-character VIN"
          />
        </div>
        <div className="form-group">
          <label htmlFor="orgName" className="form-label">Organization Name:</label>
          <input
            type="text"
            id="orgName"
            className="form-input"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
            placeholder="Enter organization name"
          />
        </div>
        <button type="submit" className="submit-button ">Add Vehicle</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddVehicle;
