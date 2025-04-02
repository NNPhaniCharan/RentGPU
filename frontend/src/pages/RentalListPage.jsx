import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaEthereum, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { getFromIPFS } from "../utils/pinata";
import { getRentalHashes } from "../utils/purchaseStorage";

const RentalListPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { newRental } = location.state || {};

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get hashes from file
        const rentalHashes = getRentalHashes();

        if (!rentalHashes || !Array.isArray(rentalHashes)) {
          throw new Error("Invalid rental data received");
        }

        // Fetch rental data for each hash from IPFS
        const rentalPromises = rentalHashes.map(async (hash) => {
          try {
            const rentalData = await getFromIPFS(hash);
            return { ...rentalData, ipfsHash: hash };
          } catch (error) {
            console.error(
              `Error fetching rental data for hash ${hash}:`,
              error
            );
            return null;
          }
        });

        const rentalData = (await Promise.all(rentalPromises)).filter(Boolean);

        // Add new rental if it exists
        if (newRental) {
          setRentals([newRental, ...rentalData]);
        } else {
          setRentals(rentalData);
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
        setError("Failed to load rental history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [newRental]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h2>Loading Rental History...</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2>Error Loading Rental History</h2>
        <p className="text-danger">
          <FaExclamationTriangle className="me-2" />
          {error}
        </p>
        <Link to="/gpus" className="btn btn-primary">
          Browse GPUs
        </Link>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>No Rentals Found</h2>
        <p className="text-muted">You haven't rented any GPUs yet.</p>
        <Link to="/gpus" className="btn btn-primary">
          Browse Available GPUs
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Rental History</h2>
      <div className="row">
        {rentals.map((rental) => (
          <div key={rental.rentalId} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0">{rental.gpu.model}</h5>
                  <span
                    className={`badge bg-${
                      rental.status === "Active"
                        ? "success"
                        : rental.status === "Completed"
                        ? "primary"
                        : "secondary"
                    }`}
                  >
                    {rental.status}
                  </span>
                </div>
                <p className="card-text">
                  <strong>Provider:</strong> {rental.gpu.provider}
                </p>
                <p className="card-text">
                  <strong>Duration:</strong> {rental.hours} hours
                </p>
                <p className="card-text">
                  <strong>Price:</strong> <FaEthereum />{" "}
                  {rental.totalPrice.toFixed(4)} ETH
                </p>
                <p className="card-text">
                  <strong>Rental ID:</strong> {rental.rentalId}
                </p>
                <p className="card-text">
                  <FaClock className="me-2" />
                  {new Date(rental.timestamp).toLocaleString()}
                </p>
                <div className="d-flex gap-2">
                  <Link
                    to={`/confirmation/${rental.gpu.id}`}
                    state={{ ipfsHash: rental.ipfsHash }}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  {rental.status === "Active" && (
                    <button className="btn btn-outline-danger">
                      End Rental
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalListPage;
