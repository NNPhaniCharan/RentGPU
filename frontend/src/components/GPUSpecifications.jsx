import React from "react";

const GPUSpecifications = ({ specs }) => {
  return (
    <ul className="modal-spec-list">
      {Object.entries(specs).map(([key, value]) => (
        <li key={key} className="modal-spec-item">
          <span className="spec-label">
            {key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1")}
          </span>
          <span className="spec-value">{value}</span>
        </li>
      ))}
    </ul>
  );
};

export default GPUSpecifications;
