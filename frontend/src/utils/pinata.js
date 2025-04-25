import axios from "axios";

/**
 * Uploads JSON data to IPFS using Pinata
 * @param {Object} jsonData - Data to upload to IPFS
 * @returns {Promise<Object>} Upload response containing IPFS hash
 * @throws {Error} If upload fails
 */
export const uploadToIPFS = async (jsonData) => {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        pinata_api_key: "0fcea2e87c23c5e53798",
        pinata_secret_api_key:
          "3db12df2ec23b2a69ea6e0fb54cc21ed53f54c2c0495764e7343e2a99d7b5295",
      },
      data: jsonData,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

/**
 * Retrieves data from IPFS using Pinata gateway
 * @param {string} hash - IPFS hash to retrieve
 * @returns {Promise<Object>} Retrieved data
 * @throws {Error} If retrieval fails
 */
export const getFromIPFS = async (hash) => {
  try {
    const response = await axios.get(
      `https://emerald-fantastic-bandicoot-583.mypinata.cloud/ipfs/${hash}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching from IPFS:", error);
    throw error;
  }
};
