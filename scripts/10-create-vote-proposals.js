import sdk from './1-initialize-sdk.js';
import { ethers } from 'ethers'; 

// The governance contract 
const vote = sdk.getVote("0x3EA883F93Abc6346faE2cB4a3ec94fCDe5Af14C4");

// The ERC-20 contract 
const token = sdk.getToken("0x7c2c645734e89b6f10D429528D04cFB8c3bD27C5"); 

(async () => {
  try {
    // Create proposal to mint 420,000 new token for the treasury 
    const amount = 420_000; 
    const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?"; 
    const executions = [
      {
        // Our token contract that actually executes the mint 
        toAddress: token.getAddress(),
        // Our nativeToken is ETH, nativeTokenValue is the amount of ETH we want
        // to send in this proposal. In this case, we're sending 0 ETH 
        // We're just minting new tokens to the treasury. So set to 0 
        nativeTokenValue: 0,
        // We're doing a mint! And we're minting to the vote, 
        // Which is acting as our treasury 
        // In this case, we need to use ethers.js to convert the amount 
        // to the correct format. This is because the amount if requires is in wei.
        transactionData: token.encoder.encode(
          "mintTo", [
            vote.getAddress(),
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
      }
    ];

    await vote.propose(description, executions); 

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("Failed to create second proposal", error); 
  }
})(); 

