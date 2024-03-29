import { AddressZero } from '@ethersproject/constants';
import sdk from './1-initialize-sdk.js'; 

(async () => {
  try {
    // Deploy a standard ERC-20 contract 
    // ERC-20: the standard all the massive coins on Ethereum adopt 
    const tokenAddress = await sdk.deployer.deployToken({
      // Token Name
      name: "MiddleEarthDAO Governance Token",
      // Token's symbol 
      symbol: "SILMAR", 
      // In case we are selling our token 
      // Because we don't, we set the AddressZero again 
      primary_sale_recipient: AddressZero,  
    });
    console.log(
      "✅ Successfully deployed token module address:", tokenAddress,
      );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})(); 


