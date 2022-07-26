import { useAddress, useMetamask, useEditionDrop } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import "./styles.css";

const App = () => {
  // Using the hooks from thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // Initialize editionDrop contract 
  const editionDrop = useEditionDrop("0x72f0948daFC590f31f9c3F729EaaFA0147EB799e");
  // State variable for us to know if user has our NFT 
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming: loading state while the NFT is minting 
  const [isClaiming, setIsClaiming] = useState(false); 

  useEffect(() => {
    // Exit if they don't have a connected wallet 
    if (!address) {
      return; 
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true); 
          console.log("🌟 This user has a membership NFT!");       
        } else {
          setHasClaimedNFT(false)
          console.log("😭 This user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balace", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true); 
      await editionDrop.claim("0", 1); 
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);  
    } catch(error) {
      setHasClaimedNFT(false); 
      console.error("Failed to mint NFT", error);   
    } finally {
      setIsClaiming(false); 
    }
  }; 
  
  // Case if user has not connected their wallet
  // Let them call connectWallet
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
