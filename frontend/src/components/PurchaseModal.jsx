import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GPUSpecifications from "./GPUSpecifications";
import { uploadToIPFS } from "../utils/pinata";
import { saveRentalHash } from "../utils/purchaseStorage";

const PurchaseModal = ({ show, onHide, gpu }) => {
  const [hours, setHours] = useState(gpu.minimumRental);
  const [loading, setLoading] = useState(false);
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

    try {
      // Create rental data object
      const rentalData = {
        gpu,
        hours,
        totalPrice,
        timestamp: new Date().toISOString(),
        rentalId: `GPU-${Date.now().toString(36).slice(-8).toUpperCase()}`,
        status: "Pending",
        contractAddress: "0x" + Math.random().toString(16).slice(2, 42), // This would come from your smart contract in production
      };

      // Upload rental data to IPFS via Pinata
      const ipfsResponse = await uploadToIPFS(rentalData);
      const ipfsHash = ipfsResponse.IpfsHash;

      // Save the IPFS hash to file
      saveRentalHash(ipfsHash);

      // Navigate to rental list page
      navigate("/rentals");
    } catch (error) {
      console.error("Error processing rental:", error);
      alert("There was an error processing your rental. Please try again.");
    } finally {
      setLoading(false);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>Rent {gpu.model}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
