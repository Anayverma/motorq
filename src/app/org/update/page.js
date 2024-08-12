import React, { useState } from "react";
import Organisation from "./Organisation";

const UpdateOrganization = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [fuelReimbursementPolicy, setFuelReimbursementPolicy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleNameChange = (e) => {
    setOrganizationName(e.target.value);
  };

  const handlePolicyChange = (e) => {
    setFuelReimbursementPolicy(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/orgs/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: organizationName, fuelReimbursementPolicy }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Fuel reimbursement policy updated successfully.");
        setError("");
      } else {
        setError(data.error || "Error updating policy.");
        setMessage("");
      }
    } catch (error) {
      console.error("There was an error updating the policy!", error);
      setError("Error updating policy.");
      setMessage("");
    }
  };

  return (
    <>
      <Organisation />
      <div className="bg-white p-6 rounded shadow-md mt-6">
        <h2 className="text-3xl font-bold mb-4">Update Organization Policy</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-xl">Organization Name:</label>
            <input
              type="text"
              value={organizationName}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xl">New Fuel Reimbursement Policy:</label>
            <input
              type="text"
              value={fuelReimbursementPolicy}
              onChange={handlePolicyChange}
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
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
};

export default UpdateOrganization;
