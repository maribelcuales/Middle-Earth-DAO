import {
  useAddress,
  useMetamask,
  useEditionDrop,
  useToken,
} from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";
import "./styles.css";

const App = () => {
  // Using the hooks from thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // Initialize editionDrop contract
  const editionDrop = useEditionDrop(
    "0x72f0948daFC590f31f9c3F729EaaFA0147EB799e"
  );
  // Initiliaze our token contract
  const token = useToken("0x7c2c645734e89b6f10D429528D04cFB8c3bD27C5");
  // State variable for us to know if user has our NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming: loading state while the NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

  // Holds the amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);

  // The array holding all of our members addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // A fancy function to shorten a wallet address, no need to show the whole thing
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // This useEffect grabs all the addresses of our members holding our NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab the users who hold the NFT with tokenId 0
    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // This useEffect grabs the number of token each member holds 
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts); 
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("Failed to get member balance", error); 
      }
    }; 
    getAllBalances();
  }, [hasClaimedNFT, token.history]); 

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
          setHasClaimedNFT(false);
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
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
      );
      // user has successfully claimed an NFT
      setHasClaimedNFT(true);
    } catch (error) {
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
  }

  // Render mint NFT screen
  return (
    <div className="mint-nft">
      <h1>Mint your Free 💎DAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "Minting..." : "Mint your NFT (FREE)"}
      </button>
    </div>
  );
};

export default App;
