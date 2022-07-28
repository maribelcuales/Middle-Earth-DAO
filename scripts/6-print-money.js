import sdk from './1-initialize-sdk.js';

// Insert Token Contract Address of ERC-20 contract printed in previous file
const token = sdk.getToken(0x7c2c645734e89b6f10D429528D04cFB8c3bD27C5); 

(async () => {
  try {
    // Set maximum supply of tokens  
    const amount = 1_000_000;
    // Interact with your deployed ERC-20 contract and mint the tokens
    await token.mintToSelf(amount); 
    const totalSupply = await token.totalSupply();
    
    // Print out how many of the tokens are distributed 
    console.log("✅ There is now", totalSupply.displayValue, "$SILMAR in circulation"); 
  } catch (error) {
    console.error("Failed to print money", error); 
  }
})();

