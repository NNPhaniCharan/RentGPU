import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FaEthereum, FaCheckCircle } from "react-icons/fa";
import GPUSpecifications from "../components/GPUSpecifications";
import { getFromIPFS } from "../utils/pinata";

const ConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { ipfsHash } = location.state || {};
  const [rentalData, setRentalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentalData = async () => {
      try {
        if (!ipfsHash) {
          throw new Error("No IPFS hash provided");
        }

        const data = await getFromIPFS(ipfsHash);
        setRentalData(data);
      } catch (error) {
        console.error("Error fetching rental data:", error);
        setError("Failed to load rental data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentalData();
  }, [ipfsHash]);

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2>Error Loading Rental Data</h2>
        <p className="text-danger">{error}</p>
        <Link to="/gpus" className="btn btn-primary">
          Browse GPUs
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h2>Loading Rental Details...</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!rentalData) {
    return (
      <div className="container py-5 text-center">
        <h2>No rental information found</h2>
        <p>It seems you've reached this page without completing a rental.</p>
        <Link to="/gpus" className="btn btn-primary">
          Browse GPUs
        </Link>
      </div>
    );
  }

  const {
    gpu,
    hours,
    totalPrice,
    timestamp,
    rentalId,
    status,
    contractAddress,
  } = rentalData;

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="text-center mb-4">
            <FaCheckCircle size={50} className="text-success mb-3" />
            <h2>Rental Confirmed!</h2>
            <p className="text-muted">
              Your GPU rental has been successfully processed.
            </p>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h4>Rental Details</h4>
              <table className="table">
                <tbody>
                  <tr>
                    <th>GPU Model</th>
                    <td>{gpu.model}</td>
                  </tr>
                  <tr>
                    <th>Provider</th>
                    <td>{gpu.provider}</td>
                  </tr>
                  <tr>
                    <th>Duration</th>
                    <td>{hours} hour(s)</td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td>
                      <FaEthereum /> {totalPrice.toFixed(4)} ETH
                    </td>
                  </tr>
                  <tr>
                    <th>Purchase Time</th>
                    <td>{new Date(timestamp).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <h4>GPU Specifications</h4>
              <GPUSpecifications specs={gpu.specs} />

              <h5 className="mt-4">API Access Details</h5>
              <div className="bg-light p-3 rounded">
                <p className="mb-2">
                  <strong>Rental ID:</strong> {rentalId}
                </p>
                <p className="mb-2">
                  <strong>IPFS Hash:</strong> <small>{ipfsHash}</small>
                </p>
                <p className="mb-2">
                  <strong>Smart Contract:</strong>{" "}
                  <small>{contractAddress}</small>
                </p>
                <p className="mb-0">
                  <strong>Status:</strong>{" "}
                  <span className="text-success">{status}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p>
              You'll receive access information via email. For any issues,
              contact our support.
            </p>
            <div className="mt-3">
              <Link to="/gpus" className="btn btn-primary me-2">
                Rent Another GPU
              </Link>
              <button className="btn btn-outline-secondary">
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
