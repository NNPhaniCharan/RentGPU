const STORAGE_KEY = "rentals";

export const saveRental = (rental) => {
  try {
    const rentals = getRentals() || [];
    rentals.push(rental);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
  } catch (error) {
    console.error("Error saving rental:", error);
  }
};

export const getRentals = () => {
  try {
    const rentalsJson = localStorage.getItem(STORAGE_KEY);
    return rentalsJson ? JSON.parse(rentalsJson) : [];
  } catch (error) {
    console.error("Error getting rentals:", error);
    return [];
  }
};

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
