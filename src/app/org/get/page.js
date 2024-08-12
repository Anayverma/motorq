"use client";
import React, { useState, useEffect } from "react";
// import Organisation from "./Organisation";

const GetOrganisation = () => {
  const [organizations, setOrganizations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/orgs", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setOrganizations(data);
      })
      .catch((error) => {
        setError("There was an error fetching the data.");
        console.error("Error fetching data:", error);
      });
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = organizations.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div />
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4">Organizations</h2>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {currentItems.map((org, index) => (
                <div key={index} className="bg-white p-4 rounded shadow-md">
                  <p>
                    <strong>Name:</strong> {org.name || "N/A"}
                  </p>
                  <p>
                    <strong>Account:</strong> {org.account || "N/A"}
                  </p>
                  <p>
                    <strong>Website:</strong> {org.website || "N/A"}
                  </p>
                  <p>
                    <strong>Fuel Reimbursement Policy:</strong> {org.fuel_reimbursement_policy || "N/A"}
                  </p>
                  <p>
                    <strong>Speed Limit Policy:</strong> {org.speed_limit_policy || "N/A"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              {Array.from({ length: Math.ceil(organizations.length / itemsPerPage) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GetOrganisation;
