import sdk from './1-initialize-sdk.js'; 
import { MaxUint256 } from '@ethersproject/constants'; 

const editionDrop = sdk.getEditionDrop(process.env.EDITION_DROP_ADDRESS);

(async () => {
  try {
    // Define claim conditions here, this is an array of objects
    // We can have multiple phases starting at different times if we want to 
    const claimConditions = [{
      // When people can start claiming NFTs (now)
      // Set date/time to current time to start minting immediately
      startTime: new Date(), 
      // Maximum number of NFTs that can be claimed 
      maxQuantity: 50_000,
      // The price of out NFT (free)
      price: 0,
      // The amount of NFTs people can claim in one transaction 
      quantityLimitPerTransaction: 1, 
      // Set the wait between transactions to MaxUint256 
      // This means people are only allowed to claim once 
      waitInSeconds: MaxUint256, 
    }] 
    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Successfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error); 
  }
})(); 


