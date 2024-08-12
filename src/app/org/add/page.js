import React, { useState } from "react";
import Organisation from "./Organisation";

const AddOrganization = () => {
  const [formData, setFormData] = useState({
    name: "",
    account: "",
    website: "",
    fuelReimbursementPolicy: "",
    speedLimitPolicy: "",
    parentName: "", // Added parent name for hierarchy
    organizationType: "child", // Default to "child"
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      organizationType: e.target.value,
      fuelReimbursementPolicy: "",
      speedLimitPolicy: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      name: formData.name,
      account: formData.account,
      website: formData.website,
      fuelReimbursementPolicy: formData.organizationType === "child" ? formData.fuelReimbursementPolicy : undefined,
      speedLimitPolicy: formData.organizationType === "child" ? formData.speedLimitPolicy : undefined,
      parentName: formData.organizationType === "child" ? formData.parentName : undefined,
    };

    try {
      const response = await fetch("/api/orgs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Organization added successfully.");
        setFormData({
          name: "",
          account: "",
          website: "",
          fuelReimbursementPolicy: "",
          speedLimitPolicy: "",
          parentName: "",
          organizationType: "child",
        });
        setError("");
      } else {
        setError(data.error || "Error adding organization.");
        setMessage("");
      }
    } catch (error) {
      console.error("There was an error adding the organization!", error);
      setError("Error adding organization.");
      setMessage("");
    }
  };

  return (
    <>
      <Organisation />
      <div className="bg-white p-6 rounded shadow-md mt-6">
        <h2 className="text-3xl font-bold mb-4">Add Organization</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-xl">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xl">Account:</label>
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xl">Website:</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-xl">Organization Type:</label>
            <div className="flex items-center">
              <label className="mr-4">
                <input
                  type="radio"
                  name="organizationType"
                  value="child"
                  checked={formData.organizationType === "child"}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Is Child
              </label>
              <label>
                <input
                  type="radio"
                  name="organizationType"
                  value="parent"
                  checked={formData.organizationType === "parent"}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Is Parent
              </label>
            </div>
          </div>

          {formData.organizationType === "child" && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-xl">Parent Organization Name:</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-xl">Fuel Reimbursement Policy:</label>
                <input
                  type="text"
                  name="fuelReimbursementPolicy"
                  value={formData.fuelReimbursementPolicy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-xl">Speed Limit Policy:</label>
                <input
                  type="text"
                  name="speedLimitPolicy"
                  value={formData.speedLimitPolicy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </>
          )}

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

export default AddOrganization;
