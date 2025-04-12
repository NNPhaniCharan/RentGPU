// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts@1.3.0/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts@1.3.0/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts@1.3.0/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

/**
 * @title GPURentalEscrow
 * @notice This contract handles GPU verification and escrow services for GPU rentals
 * @dev Uses Chainlink Functions for verification and handles escrow payments
 */
contract GPURentalEscrow is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // State variables to store the last response and error
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    // Provider address set during contract initialization
    address public provider;

    // Escrow related state variables
    struct Rental {
        address user;
        uint256 amount;
        bool isVerified;
        bool isResolved;
        bytes32 requestId;
    }
    
    mapping(string => Rental) public rentals;
    mapping(bytes32 => string) public requestToIpfs;

    // Custom error types
    error UnexpectedRequestID(bytes32 requestId);
    error InsufficientFunds();
    error AlreadyVerified();
    error AlreadyResolved();
    error NotVerified();
    error Unauthorized();
    error TransferFailed();
    error RentalNotFound();

    // Events
    event Response(bytes32 indexed requestId, string ipfsHash, uint256 result, bytes response, bytes err);
    event RentalDeposited(string indexed ipfsHash, address indexed user, uint256 amount);
    event RentalVerified(string indexed ipfsHash, uint256 score);
    event RentalResolvedAndPaid(string indexed ipfsHash, address indexed provider, uint256 providerAmount, address indexed user, uint256 userAmount);

    // Router address - Hardcoded for Sepolia
    address router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

    string source = "const specificGpuData = await Functions.makeHttpRequest({url: `https://emerald-fantastic-bandicoot-583.mypinata.cloud/ipfs/${args[0]}`});"
    "const allGpusData = await Functions.makeHttpRequest({url: `https://emerald-fantastic-bandicoot-583.mypinata.cloud/ipfs/bafkreih4yc7qfawcht2uwmxmo6qyumvr3m7p4pnbyreymyfmkbifctf53a`});"
    "const model = specificGpuData.data.gpu.model;"
    "const referenceGpu = allGpusData.data.GpuData.find(gpu => gpu.model === model);"
    "const referenceSpecs = referenceGpu.specs;"
    "const providedSpecs = specificGpuData.data.gpu.specs;"
    "const total = "
    "Math.min(100, (referenceSpecs.cores / providedSpecs.cores) * 100) +"
    "Math.min(100, (parseFloat(referenceSpecs.memorySize) / parseFloat(providedSpecs.memorySize)) * 100) + "
    "Math.min(100, (parseFloat(referenceSpecs.memoryBandwidth) / parseFloat(providedSpecs.memoryBandwidth)) * 100) +"
    "Math.min(100, (parseFloat(referenceSpecs.performance) / parseFloat(providedSpecs.performance)) * 100);"
    "const averagePercentage = Math.round(total / 4);"
    "return Functions.encodeUint256(averagePercentage);";

    uint32 gasLimit = 300000;
    bytes32 donID = 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    mapping(string => uint256) public results;
    uint256 public result;

    constructor() FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    function depositRental(string calldata ipfsHash, address _provider) external payable {
        if (msg.value == 0) revert InsufficientFunds();
        Rental storage rental = rentals[ipfsHash];
        if (rental.user != address(0)) revert AlreadyVerified();
        
        provider = _provider; // Set provider address for this rental
        rental.user = msg.sender;
        rental.amount = msg.value;
        rental.isVerified = false;
        rental.isResolved = false;
        
        emit RentalDeposited(ipfsHash, msg.sender, msg.value);
    }

    function verifyRental(string calldata ipfsHash, uint64 subscriptionId) 
        external 
        returns (bytes32 requestId) 
    {
        Rental storage rental = rentals[ipfsHash];
        if (rental.user == address(0)) revert RentalNotFound();
        if (rental.isVerified) revert AlreadyVerified();
        if (rental.amount == 0) revert InsufficientFunds();
        
        string[] memory args = new string[](1);
        args[0] = ipfsHash;
        
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        req.setArgs(args);
        
        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
        
        requestToIpfs[requestId] = ipfsHash;
        rental.requestId = requestId;
        s_lastRequestId = requestId;
        
        return requestId;
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) 
        internal 
        override 
    {
        string memory ipfsHash = requestToIpfs[requestId];
        if (bytes(ipfsHash).length == 0) revert UnexpectedRequestID(requestId);
        
        s_lastResponse = response;
        result = abi.decode(response, (uint256));
        results[ipfsHash] = result;
        s_lastError = err;
        
        Rental storage rental = rentals[ipfsHash];
        rental.isVerified = true;
        
        emit Response(requestId, ipfsHash, result, s_lastResponse, s_lastError);
        emit RentalVerified(ipfsHash, result);
    }

    function resolveRental(string calldata ipfsHash) external {
        Rental storage rental = rentals[ipfsHash];
        if (rental.user == address(0)) revert RentalNotFound();
        if (!rental.isVerified) revert NotVerified();
        if (rental.isResolved) revert AlreadyResolved();
        
        uint256 val = results[ipfsHash];
        uint256 providerAmount = (rental.amount * val) / 100;
        uint256 userAmount = rental.amount - providerAmount;
        
        rental.isResolved = true;
        
        if (providerAmount > 0) {
            (bool providerSent, ) = provider.call{value: providerAmount}("");
            if (!providerSent) revert TransferFailed();
        }
        
        if (userAmount > 0) {
            (bool userSent, ) = rental.user.call{value: userAmount}("");
            if (!userSent) revert TransferFailed();
        }
        
        emit RentalResolvedAndPaid(ipfsHash, provider, providerAmount, rental.user, userAmount);
    }
}