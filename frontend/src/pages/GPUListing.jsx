import React from 'react';
import GPUCard from '../components/GPUCard';
import gpuData from '../data/gpudata';

const GPUListing = () => {
  return (
    <div className="gpu-listing">
      <div className="container">
        <h2>Available GPUs for Rent</h2>
        <p className="text-center mb-4">
          Browse our selection of high-performance GPUs available for immediate rental.
          All rentals include performance verification and automated payment adjustments.
        </p>
        
        <div className="gpu-grid">
          {gpuData.map(gpu => (
            <GPUCard key={gpu.id} gpu={gpu} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GPUListing;