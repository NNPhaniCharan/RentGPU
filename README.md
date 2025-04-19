# Decentralized GPU Rental Platform

A blockchain-based platform for renting GPUs with automated performance verification and fair payment distribution.

## 📋 Project Overview

This project implements a decentralized GPU rental marketplace that solves the trust and verification problems in traditional GPU rental systems. Using Chainlink Functions and smart contracts, we provide automated performance verification and fair payment distribution based on actual GPU performance.

## 📺 Demo Video

[![GPU Rental Platform Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

## 🎯 Technical Features

- **Smart Contract Security**: Implements escrow mechanism with automated verification
- **Performance Verification**:
  - Compares actual vs promised GPU specifications
  - Uses Chainlink Functions for trustless verification
- **Fair Payment System**:
  - Automatic payment adjustment based on performance score
  - Proportional refunds for underperforming GPUs
  - Real-time transaction tracking
- **Decentralized Storage**:
  - GPU specifications stored on IPFS
  - Immutable performance records
  - Transparent verification results

## 💻 System Requirements

- Node.js v16 or higher
- MetaMask wallet with Sepolia testnet ETH
- Modern web browser with MetaMask extension
- Git

## 🏗️ Architecture

![alt text](Documents/image.png)

### System Components
- **Server**: Monitors and reports actual GPU usage statistics
- **Pinata**: Handles IPFS storage for stats and verification
- **Chain Link**: Provides oracle services for data verification
- **Smart Contract**: Manages rental agreements, payments, and deposits
- **Client/Provider**: Offers GPU resources for rental
- **User**: Rents GPU resources and provides deposits

### Directory Structure
```
├── frontend/               # React-based web interface
├── SmartContract/         # Solidity smart contracts
└── docs/                  # Documentation
```

## 🛠️ Technology Stack

- **Frontend**: React.js, Bootstrap
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity
- **External Services**:
  - Chainlink Functions
  - IPFS (Pinata)
  - Web3.js/Ethers.js

## 🔧 Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/NNPhaniCharan/GPURental.git
cd GPURental
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Configure environment variables:

```bash
# Create .env file in frontend directory
REACT_APP_PINATA_JWT=your_pinata_jwt
REACT_APP_GATEWAY_URL=your_pinata_gateway_url

REACT_APP_CONTRACT_ADDRESS=0xE590ff0E4FB5fCE671053ED5091F215204F49433
```

4. Start the development server:

```bash
npm start
```

## 🔄 Workflow

1. **Rental Process**:

   - User selects a GPU and makes payment in ETH
   - Payment is held in smart contract escrow
   - Provider uploads performance metrics to IPFS

2. **Verification Process**:

   - Chainlink Functions fetch and compare actual vs promised performance
   - Smart contract calculates fulfillment percentage
   - Payment is distributed proportionally based on performance

3. **Payment Distribution**:
   - Provider receives payment based on delivered performance
   - User receives refund for any underperformance

## 📝 Smart Contract Details

- **Network**: Sepolia Testnet
- **Contract Address**: `0xE590ff0E4FB5fCE671053ED5091F215204F49433`
- **Chainlink Functions Subscription ID**: `4553`

## 🌐 Deployment

The application is live and can be accessed at: [GPU Rental Platform](https://rent-gpu-rose.vercel.app/)

### Features Available in Live Demo:
- Browse available GPUs for rent
- Connect wallet using MetaMask
- View detailed GPU specifications
- Interact with smart contracts on Sepolia testnet
- Real-time performance monitoring
- Automated payment processing

### Testing the Live System:
1. Visit [https://rent-gpu-rose.vercel.app/](https://rent-gpu-rose.vercel.app/)
2. Connect your MetaMask wallet (Sepolia network)
3. Ensure you have some Sepolia ETH for testing
4. Browse and interact with available GPU listings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team

- _Narayana Phani Charan Nimmagadda_
- _Sai Madhukar Vanam_

## 🌟 Acknowledgments

- Chainlink Functions for enabling automated performance verification
- IPFS/Pinata for decentralized storage
