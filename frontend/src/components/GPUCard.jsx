import React, { useState } from "react";
import { FaStar, FaEthereum } from "react-icons/fa";
import PurchaseModal from "./PurchaseModal";

const GPUCard = ({ gpu }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="gpu-card">
        {/* <img src={gpu.image} alt={gpu.model} className="gpu-card-img" /> */}
        <div className="gpu-card-content">
          <h3>{gpu.model}</h3>
          <p>Provider: {gpu.provider}</p>
          <div className="gpu-card-specs">
            <p>
              <strong>Performance:</strong> {gpu.specs.performance}
            </p>
            <p>
              <strong>Memory:</strong> {gpu.specs.memorySize}
            </p>
          </div>
          <div className="gpu-card-price">
            <FaEthereum /> {gpu.price} ETH/hour
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FaStar className="text-warning me-1" />
              <span>
                {gpu.rating} ({gpu.reviews})
              </span>
            </div>
            <button className="btn btn-primary" onClick={handleShowModal}>
              Rent Now
            </button>
          </div>
        </div>
      </div>

      <PurchaseModal show={showModal} onHide={handleCloseModal} gpu={gpu} />
    </>
  );
};

export default GPUCard;
