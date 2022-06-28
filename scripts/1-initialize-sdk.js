import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

// Import and configure .env file
import dotenv from "dotenv";
dotenv.config();

// checking if .env is working
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("🛑 Private key not found.");
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
  console.log("🛑 Alchemy API URL not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

// RPC URL, use Alchemy API URL from .env file 
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
// Wallet private key (NEVER share with anyone and add to .env )    
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("SDK initialized by address:", address)
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})();

// export initialized thirdweb SDK for use in other scripts 
export default sdk; 
