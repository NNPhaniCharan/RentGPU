import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEthereum, FaExternalLinkAlt } from "react-icons/fa";
import { getRentals } from "../utils/rentalStorage";

const MyRentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedRentals = getRentals() || [];
      // Sort rentals by timestamp in descending order (newest first)
      const sortedRentals = storedRentals.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setRentals(sortedRentals);
    } catch (error) {
      console.error("Error loading rentals:", error);
      setError("Failed to load rental history");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h2>Loading Your Rentals...</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2>Error Loading Rentals</h2>
        <p className="text-danger">{error}</p>
        <Link to="/gpus" className="btn btn-primary">
          Browse GPUs
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Rentals</h2>
        <Link to="/gpus" className="btn btn-primary">
          Rent Another GPU
        </Link>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-5">
          <h4>No rentals found</h4>
          <p className="text-muted">You haven't rented any GPUs yet.</p>
          <Link to="/gpus" className="btn btn-primary">
            Browse Available GPUs
          </Link>
        </div>
      ) : (
        <div className="row">
          {rentals.map((rental) => (
            <div key={rental.rentalId} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{rental.gpu.model}</h5>
                  <div className="mb-3">
                    <span
                      className={`badge bg-${
                        rental.status === "Resolved"
                          ? "success"
                          : rental.status === "Verified"
                          ? "info"
                          : "warning"
                      }`}
                    >
                      {rental.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Provider:</strong> {rental.gpu.provider}
                    </p>
                    <p className="mb-1">
                      <strong>Duration:</strong> {rental.hours} hour(s)
                    </p>
                    <p className="mb-1">
                      <strong>Price:</strong> <FaEthereum />{" "}
                      {rental.totalPrice.toFixed(4)} ETH
                    </p>
                    <p className="mb-1">
                      <strong>Rental Date:</strong>{" "}
                      {new Date(rental.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="mb-3">
                    {rental.depositTxHash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${rental.depositTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-block mb-1"
                      >
                        View Deposit Transaction{" "}
                        <FaExternalLinkAlt className="ms-1" />
                      </a>
                    )}
                    {rental.verificationTxHash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${rental.verificationTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-block mb-1"
                      >
                        View Verification Transaction{" "}
                        <FaExternalLinkAlt className="ms-1" />
                      </a>
                    )}
                    {rental.resolveTxHash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${rental.resolveTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-block mb-1"
                      >
                        View Resolution Transaction{" "}
                        <FaExternalLinkAlt className="ms-1" />
                      </a>
                    )}
                  </div>
                  <Link
                    to={`/confirmation/${rental.rentalId}`}
                    state={{
                      ipfsHash: rental.ipfsHash,
                      rentalData: rental,
                      txHash: rental.depositTxHash,
                    }}
                    className="btn btn-outline-primary w-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRentalsPage;
