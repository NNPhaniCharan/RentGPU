/** @constant {string} Key for storing rentals in localStorage */
const STORAGE_KEY = "rentals";

/**
 * Saves a rental object to localStorage
 * @param {Object} rental - The rental object to save
 * @param {string} rental.rentalId - Unique identifier for the rental
 * @param {Object} rental.gpu - GPU details
 * @param {number} rental.hours - Rental duration in hours
 * @throws {Error} If save operation fails
 */
export const saveRental = (rental) => {
  try {
    const rentals = getRentals() || [];
    rentals.push(rental);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
  } catch (error) {
    console.error("Error saving rental:", error);
  }
};

/**
 * Retrieves all stored rentals
 * @returns {Object[]} Array of rental objects
 */
export const getRentals = () => {
  try {
    const rentalsJson = localStorage.getItem(STORAGE_KEY);
    return rentalsJson ? JSON.parse(rentalsJson) : [];
  } catch (error) {
    console.error("Error getting rentals:", error);
    return [];
  }
};

/**
 * Updates the status of a specific rental
 * @param {string} rentalId - ID of the rental to update
 * @param {string} status - New status value
 */
export const updateRentalStatus = (rentalId, status) => {
  try {
    const rentals = getRentals();
    const rentalIndex = rentals.findIndex(
      (rental) => rental.rentalId === rentalId
    );

    if (rentalIndex !== -1) {
      rentals[rentalIndex] = {
        ...rentals[rentalIndex],
        status,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
    }
  } catch (error) {
    console.error("Error updating rental status:", error);
  }
};

/**
 * Updates transaction details for a specific rental
 * @param {string} rentalId - ID of the rental to update
 * @param {Object} transactions - Transaction details to update
 */
export const updateRentalTransactions = (rentalId, transactions) => {
  try {
    const rentals = getRentals();
    const rentalIndex = rentals.findIndex(
      (rental) => rental.rentalId === rentalId
    );

    if (rentalIndex !== -1) {
      rentals[rentalIndex] = {
        ...rentals[rentalIndex],
        ...transactions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
    }
  } catch (error) {
    console.error("Error updating rental transactions:", error);
  }
};
