import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FaEthereum, FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import GPUSpecifications from "../components/GPUSpecifications";
import { getFromIPFS } from "../utils/pinata";
import { ethers } from "ethers";
import GPURentalEscrow from "../contracts/GPURentalEscrow.json";
import {
  updateRentalStatus,
  updateRentalTransactions,
} from "../utils/rentalStorage";

const COOLDOWN_PERIOD = 10; // seconds for testing

const ConfirmationPage = () => {
  const { rentalId } = useParams();
  const location = useLocation();
  const {
    ipfsHash,
    rentalData: initialRentalData,
    txHash: depositTxHash,
    vTxHash,
    rTxhash,
  } = location.state || {};
  const [rentalData, setRentalData] = useState(initialRentalData);
  const [loading, setLoading] = useState(!initialRentalData);
  const [error, setError] = useState(null);
  const [canVerify, setCanVerify] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [verificationTxHash, setVerificationTxHash] = useState(vTxHash ?? null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState(null);
  const [resolveTxHash, setResolveTxHash] = useState(rTxhash ?? null);
  const [verifyCooldown, setVerifyCooldown] = useState(COOLDOWN_PERIOD);
  const [resolveCooldown, setResolveCooldown] = useState(COOLDOWN_PERIOD);
  const [verificationResult, setVerificationResult] = useState(rentalData?.verificationResult ?? null);

  // Cooldown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (verifyCooldown > 0) {
        setVerifyCooldown((prev) => Math.max(0, prev - 1));
      }
      if (resolveCooldown > 0) {
        setResolveCooldown((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [verifyCooldown, resolveCooldown]);

  useEffect(() => {
    const fetchRentalData = async () => {
      try {
        if (!ipfsHash) {
          throw new Error("No IPFS hash provided");
        }

        const data = await getFromIPFS(ipfsHash);
        if (data.rentalId !== rentalId) {
          throw new Error("Rental ID mismatch");
        }
        setRentalData(data);
      } catch (error) {
        console.error("Error fetching rental data:", error);
        setError("Failed to load rental data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (!initialRentalData) {
      fetchRentalData();
    }
  }, [ipfsHash, rentalId, initialRentalData]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      setVerificationError(null);

      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this feature");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        GPURentalEscrow.abi,
        signer
      );

      const tx = await contract.verifyRental(
        ipfsHash,
        ethers.BigNumber.from("4553")
      );
      const receipt = await tx.wait();
      const verifyTxHash = receipt.transactionHash;
      setVerificationTxHash(verifyTxHash);

      // Update rental status and transactions in local storage
      updateRentalStatus(rentalId, "Verified");
      updateRentalTransactions(rentalId, { verificationTxHash: verifyTxHash });

      // Update rental status in state
      setRentalData((prev) => ({
        ...prev,
        status: "Verified",
      }));

      // Start resolve cooldown after verification
      setResolveCooldown(COOLDOWN_PERIOD);
    } catch (error) {
      console.error("Error verifying rental:", error);
      setVerificationError(error.message || "Failed to verify rental");
    } finally {
      setVerifying(false);
    }
  };

  const handleResolve = async () => {
    try {
      setResolving(true);
      setResolveError(null);

      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this feature");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        GPURentalEscrow.abi,
        signer
      );

      const [tx, result] = await Promise.all([
        contract.resolveRental(ipfsHash),
        contract.results(ipfsHash),
      ]);
      const receipt = await tx.wait();
      const resolveTxHash = receipt.transactionHash;
      setResolveTxHash(resolveTxHash);
      const verificationResult = +result.toString();
      setVerificationResult(verificationResult);

      // Update rental status and transactions in local storage
      updateRentalStatus(rentalId, "Resolved");
      updateRentalTransactions(rentalId, {
        resolveTxHash,
        verificationResult,
      });

      // Update rental status in state
      setRentalData((prev) => ({
        ...prev,
        status: "Resolved",
      }));
    } catch (error) {
      console.error("Error resolving rental:", error);
      setResolveError(error.message || "Failed to resolve rental");
    } finally {
      setResolving(false);
    }
  };

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

  const { gpu, hours, totalPrice, timestamp, status, contractAddress } =
    rentalData;

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
                    <th>Provider Address</th>
                    <td>
                      <small className="text-break">
                        {gpu.providerAddress}
                      </small>
                    </td>
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
                  <tr>
                    <th>Deposit Transaction</th>
                    <td>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${depositTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center"
                      >
                        View on Etherscan <FaExternalLinkAlt className="ms-1" />
                      </a>
                    </td>
                  </tr>
                  {verificationTxHash && (
                    <tr>
                      <th>Verification Transaction</th>
                      <td>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${verificationTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-flex align-items-center"
                        >
                          View on Etherscan{" "}
                          <FaExternalLinkAlt className="ms-1" />
                        </a>
                      </td>
                    </tr>
                  )}
                  {resolveTxHash && (
                    <tr>
                      <th>Resolution Transaction</th>
                      <td>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${resolveTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-flex align-items-center"
                        >
                          View on Etherscan{" "}
                          <FaExternalLinkAlt className="ms-1" />
                        </a>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th>Contract</th>
                    <td>
                      <a
                        href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center"
                      >
                        View Contract on Etherscan{" "}
                        <FaExternalLinkAlt className="ms-1" />
                      </a>
                    </td>
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
                <p className="mb-2">
                  <strong>Provider Address:</strong>{" "}
                  <small>{gpu.providerAddress}</small>
                </p>
                <p className="mb-0">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`text-${
                      status === "Resolved"
                        ? "success"
                        : status === "Verified"
                        ? "info"
                        : "warning"
                    }`}
                  >
                    {status}
                  </span>
                </p>
              </div>

              {status === "Pending" && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Verification</h5>
                    {verifyCooldown > 0 && (
                      <span className="text-muted">
                        Cooldown: {formatTime(verifyCooldown)}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleVerify}
                    disabled={!canVerify || verifying || verifyCooldown > 0}
                  >
                    {verifying ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Verifying...
                      </>
                    ) : verifyCooldown > 0 ? (
                      `Wait ${formatTime(verifyCooldown)}`
                    ) : (
                      "Verify Rental"
                    )}
                  </button>
                  {verificationError && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {verificationError}
                    </div>
                  )}
                </div>
              )}

              {status === "Verified" && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Resolution</h5>
                    {resolveCooldown > 0 && (
                      <span className="text-muted">
                        Cooldown: {formatTime(resolveCooldown)}
                      </span>
                    )}
                  </div>
                  <p className="text-muted small mb-3">
                    Resolving will release the payment to the provider and
                    complete the rental.
                  </p>
                  <button
                    className="btn btn-success w-100"
                    onClick={handleResolve}
                    disabled={resolving || resolveCooldown > 0}
                  >
                    {resolving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Resolving Payment...
                      </>
                    ) : resolveCooldown > 0 ? (
                      `Wait ${formatTime(resolveCooldown)}`
                    ) : (
                      "Release Payment & Complete Rental"
                    )}
                  </button>
                  {resolveError && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {resolveError}
                    </div>
                  )}
                </div>
              )}

              {status === "Resolved" && verificationResult && (
                <div className="mt-4">
                  <h5 className="mb-3">Payment Distribution</h5>
                  <div className="bg-light p-3 rounded border">
                    <div className="mb-3">
                      <p className="text-muted small mb-2">
                        Based on GPU efficiency of {verificationResult}%
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">
                        Provider's Share ({verificationResult}%)
                      </span>
                      <span className="fw-bold">
                        {totalPrice * (verificationResult / 100)} ETH
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">
                        Your Refund ({100 - verificationResult}%)
                      </span>
                      <span className="fw-bold">
                        {totalPrice - totalPrice * (verificationResult / 100)}{" "}
                        ETH
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
