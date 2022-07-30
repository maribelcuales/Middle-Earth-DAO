import sdk from "./1-initialize-sdk.js";

// This is our governance contract
const vote = sdk.getVote("0x3EA883F93Abc6346faE2cB4a3ec94fCDe5Af14C4");

// This is our ERC-20 contract
const token = sdk.getToken("0x7c2c645734e89b6f10D429528D04cFB8c3bD27C5");

(async () => {
  try {
    // Give our treasury the power to mint additional token if needed
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Successfully gave vote contract permissions to act on token contract."
    );
  } catch (error) {
    console.error(
      "Failed to grant vote contract permissions on token contract.",
      error
    );
    process.exit(1);
  }
})();
