import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GPUSpecifications from "./GPUSpecifications";
import { uploadToIPFS } from "../utils/pinata";
import { ethers } from "ethers";
import GPURentalEscrow from "../contracts/GPURentalEscrow.json";
import { saveRental } from "../utils/rentalStorage";

const PurchaseModal = ({ show, onHide, gpu }) => {
  const [hours, setHours] = useState(gpu.minimumRental);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const totalPrice = gpu.price * hours;

  const handleHoursChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= gpu.minimumRental) {
      setHours(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this feature");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create rental data object
      const rentalData = {
        gpu,
        hours,
        totalPrice,
        timestamp: new Date().toISOString(),
        rentalId: `GPU-${Date.now().toString(36).slice(-8).toUpperCase()}`,
        status: "Pending",
        contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
      };

      // Upload rental data to IPFS via Pinata
      const ipfsResponse = await uploadToIPFS(rentalData);
      const ipfsHash = ipfsResponse.IpfsHash;

      // Connect to the smart contract
      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        GPURentalEscrow.abi,
        signer
      );

      // Convert ETH to Wei
      const amountInWei = ethers.utils.parseEther(totalPrice.toString());

      // Call the depositRental function with provider address
      const tx = await contract.depositRental(ipfsHash, gpu.providerAddress, {
        value: amountInWei,
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      const txHash = receipt.transactionHash;

      // Save the rental data to local storage with all necessary information
      const rentalToSave = {
        ...rentalData,
        ipfsHash,
        depositTxHash: txHash,
      };

      saveRental(rentalToSave);

      // Navigate to confirmation page
      navigate(`/confirmation/${rentalData.rentalId}`, {
        state: { ipfsHash, rentalData: rentalToSave, txHash },
      });
    } catch (error) {
      console.error("Error processing rental:", error);
      setError(
        error.message ||
          "There was an error processing your rental. Please try again."
      );
    } finally {
      setLoading(false);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Rent {gpu.model}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="row">
          <div className="col-md-6">
            {/* <img src={gpu.image} alt={gpu.model} className="img-fluid mb-3" /> */}
            <h5>Description</h5>
            <p>{gpu.description}</p>

            <div className="availability mt-3">
              <h5>Availability</h5>
              <p>
                {gpu.availability === "Immediate"
                  ? "Available immediately"
                  : `Available in ${gpu.availability}`}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <h5>GPU Specifications</h5>
            <GPUSpecifications specs={gpu.specs} />

            <Form onSubmit={handleSubmit} className="mt-4">
              <Form.Group className="mb-3">
                <Form.Label>Rental Duration (hours)</Form.Label>
                <Form.Control
                  type="number"
                  min={gpu.minimumRental}
                  value={hours}
                  onChange={handleHoursChange}
                  required
                />
                <Form.Text className="text-muted">
                  Minimum rental period: {gpu.minimumRental} hour(s)
                </Form.Text>
              </Form.Group>

              <div className="pricing mb-4">
                <div className="d-flex justify-content-between">
                  <span>Hourly Rate:</span>
                  <span>
                    <FaEthereum /> {gpu.price} ETH
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Hours:</span>
                  <span>{hours}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong>
                    <FaEthereum /> {totalPrice.toFixed(4)} ETH
                  </strong>
                </div>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Rental"}
              </Button>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PurchaseModal;
