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
