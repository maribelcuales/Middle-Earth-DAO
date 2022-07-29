import { useAddress, useMetamask, useEditionDrop, useToken } from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";
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
      // user has successfully claimed an NFT 
      setHasClaimedNFT(true);  
    } catch(error) {
      setHasClaimedNFT(false); 
      console.error("Failed to mint NFT", error);   
    } finally {
      // set to false to stop the loading state 
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

  // Render DAO Member Page   
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>💎 MiddleEarth DAO 💎 Member Page 💎</h1>
        <p>Congratulations on being a Member!</p>
      </div>
    );
  }; 

  // Render mint NFT screen 
  return (
    <div className="mint-nft">
      <h1>Mint your Free 💎DAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Minting..." : "Mint your NFT (FREE)"}
      </button>
    </div>
  );
};

export default App;
