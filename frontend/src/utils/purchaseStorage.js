/** @constant {string} Key for storing rental hashes in localStorage */
const RENTAL_HASHES_KEY = "rentalHashes";

/**
 * Saves a rental IPFS hash to localStorage
 * @param {string} ipfsHash - The IPFS hash to save
 * @returns {boolean} True if save was successful
 * @throws {Error} If save operation fails
 */
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

/**
 * Retrieves all stored rental IPFS hashes
 * @returns {string[]} Array of IPFS hashes
 */
export const getRentalHashes = () => {
  try {
    const hashes = localStorage.getItem(RENTAL_HASHES_KEY);
    return hashes ? JSON.parse(hashes) : [];
  } catch (error) {
    console.error("Error getting rental hashes:", error);
    return [];
  }
};
