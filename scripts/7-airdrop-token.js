import sdk from "./1-initialize-sdk.js";

// Address to our ERC-1155 membership NFT contract.
const editionDrop = sdk.getEditionDrop("0x72f0948daFC590f31f9c3F729EaaFA0147EB799e");

// Address to our ERC-20 token contract.
const token = sdk.getToken("0x7c2c645734e89b6f10D429528D04cFB8c3bD27C5");

(async () => {
  try {
    // Grab all the addresses of people who own the membership NFT, 
    // which has a tokenId of 0.
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet. Get some friends to claim the FREE NFTs!",
      );
      process.exit(0);
    }

    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random # between 1000 and 10000.
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

      // Set up the target
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    // Call transferBatch on all our airdrop targets.
    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all NFT holders!");
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();

