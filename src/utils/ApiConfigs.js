import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

const SECRET_KEY = 'msad';  // Use the same secret key as in the backend
const hash = nacl.hash(naclUtil.decodeUTF8(SECRET_KEY));  // Hash the key using nacl.hash
const paddedSecretKey = hash.slice(0, 32); 
export const Api_base_url = 'http://localhost:5000';

// Decrypt function
function decrypt(encryptedData) {
  const nonce = naclUtil.decodeBase64(encryptedData.nonce); // Decode the nonce from Base64
  const encrypted = naclUtil.decodeBase64(encryptedData.encrypted); // Decode the encrypted message from Base64

  const decrypted = nacl.secretbox.open(encrypted, nonce, paddedSecretKey); // Use the padded key

  if (!decrypted) {
    throw new Error('Failed to decrypt data');
  }

  return JSON.parse(naclUtil.encodeUTF8(decrypted)); // Convert decrypted Uint8Array back to JSON
}

export const msalConfig = async () => {
  try {
    const response = await fetch(`${Api_base_url}/api/mad`);
    if (!response.ok) {
      throw new Error('Failed to fetch Azure AD configuration');
    }
    
    const jsonResponse = await response.json();
    const encryptedData = jsonResponse?.data;

    if (!encryptedData) {
      throw new Error('No encrypted data received');
    }

    // Decrypt the data
    const authConfig = decrypt(encryptedData);

    return {
      auth: {
        clientId: authConfig.client_id,
        authority: `https://login.microsoftonline.com/${authConfig.azure_tenant}`,
        redirectUri: "http://localhost:5173/dashboard", // Replace with your desired redirect URI
      },
      cache: {
        cacheLocation: "sessionStorage", // Store tokens in sessionStorage
        storeAuthStateInCookie: false,
      },
    };
  } catch (error) {
    console.error('Error fetching MSAL configuration:', error);
    throw error;
  }
};

export const loginRequest = {
  scopes: ["User.Read"], // Permissions you requested in Azure AD
};