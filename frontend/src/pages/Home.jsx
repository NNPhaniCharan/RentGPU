import React from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaShieldAlt, FaEthereum, FaChartLine } from "react-icons/fa";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Decentralized GPU Rental Platform</h1>
          <p>
            Rent high-performance GPU computing power with performance
            verification and automatic penalties for underdelivering providers.
          </p>
          <Link to="/gpus" className="btn btn-primary btn-lg">
            Start Renting
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaBolt />
              </div>
              <h3>High-Performance GPUs</h3>
              <p>
                Access top-tier computing power from NVIDIA and AMD GPUs,
                perfect for AI training, rendering, and scientific computing.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Performance Verification</h3>
              <p>
                Our platform verifies actual GPU performance and automatically
                adjusts payments if providers fail to deliver promised power.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaEthereum />
              </div>
              <h3>Secure Blockchain Payments</h3>
              <p>
                All transactions are secured by smart contracts, ensuring
                transparent and fair payment based on actual performance.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Flexible Rental Options</h3>
              <p>
                Choose from hourly to monthly rental options with no minimum
                commitment and immediate availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">1. Request GPU Power</h5>
                  <p className="card-text">
                    Browse available GPUs and select the one that meets your
                    requirements. Specify the amount of computing power and
                    duration you need.
                  </p>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">2. Make a Secure Payment</h5>
                  <p className="card-text">
                    Pay for your rental using cryptocurrency. Your payment is
                    held in a smart contract until the job is completed
                    satisfactorily.
                  </p>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">3. Performance Verification</h5>
                  <p className="card-text">
                    Our system automatically verifies the actual GPU performance
                    provided. If the provider delivers less than promised,
                    penalties are applied.
                  </p>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">4. Fair Payment Distribution</h5>
                  <p className="card-text">
                    Upon job completion, the payment is distributed based on the
                    actual performance delivered. You only pay for what you
                    actually receive.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/gpus" className="btn btn-primary btn-lg">
              Browse Available GPUs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
