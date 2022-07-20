import { useAddress, useMetamask, useEditionDrop } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import "./styles.css";

const App = () => {
  // Using the hooks from thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // Initialize editionDrop contract 
  const editionDrop = useEditionDrop(process.env.EDITION_DROP_ADDRESS);
  // State variable for us to know if user has our NFT 
  const [hasClaimNFT, setHasClaimNFT] = useState(false);
  
  // case if user has not connected their wallet
  // let them call connectWallet
  if (!address) {
    return (
      <div className="landing">
        <h1 className="welcomeHeader">Welcome to MiddleEarthDAO 🧙‍♂️</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your Wallet
        </button>
      </div>
    );
  }

  // case where users have successfully connected their wallets
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>
  );
};

export default App;
