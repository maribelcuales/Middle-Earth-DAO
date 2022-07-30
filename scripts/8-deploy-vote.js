import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      // Give the governance contract a name 
      name: "Fantastic MiddleEarth DAO", 
      
      // Location of our governance token, our ERC-20 contract
      voting_token_address: "0x7c2c645734e89b6f10D429528D04cFB8c3bD27C5", 

      // These parameters are specified in number of blocks 
      // Assuming block time of around 13.14 seconds (for Ethereum)
      
      // After a proposal is created, when can members start voting? 
      // For now, we set it to immediately 
      voting_delay_in_blocks: 0,

      // How long do members have to vote on a proposal when it's created? 
      // We will set it to 1 day = 6750 blocks 
      voting_period_in_blocks: 6570,

      // The minimum % of the total supply that need to vote for 
      // The proposal to be valid after the time for the proposal has ended 
      voting_quorum_fraction: 0, 

      // What's the minimum # of tokens a user needs to be allowed to create a proposal? 
      // Set it to 0. Meaning no tokens are required for a user to be allowed 
      // To create a proposal 
      proposal_token_threshold: 0,
    }); 

    
  }
})