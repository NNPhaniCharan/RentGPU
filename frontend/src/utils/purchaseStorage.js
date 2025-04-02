// Utility functions for storing and retrieving IPFS hashes
const RENTAL_HASHES_KEY = "rentalHashes";

export const saveRentalHash = (ipfsHash) => {
  try {
    // Get existing hashes from localStorage
    const existingHashes = JSON.parse(
      localStorage.getItem(RENTAL_HASHES_KEY) || "[]"
    );

    // Add new hash if it doesn't exist
    if (!existingHashes.includes(ipfsHash)) {
      existingHashes.push(ipfsHash);
      localStorage.setItem(RENTAL_HASHES_KEY, JSON.stringify(existingHashes));
    }

    return true;
  } catch (error) {
    console.error("Error saving rental hash:", error);
    throw error;
  }
};

export const getRentalHashes = () => {
  try {
    const hashes = localStorage.getItem(RENTAL_HASHES_KEY);
    return hashes ? JSON.parse(hashes) : [];
  } catch (error) {
    console.error("Error getting rental hashes:", error);
    return [];
  }
};
