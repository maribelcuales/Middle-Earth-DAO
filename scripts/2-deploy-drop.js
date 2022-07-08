import { AddressZero } from '@ethersproject/constants'; 
import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // the collection's name
      name: "MiddleEarthDAO Membership",
      // description for the collection 
      description: "A DAO for all folks of Middle Earth.",
      // the image that will be held as the NFT 
      image: readFileSync("scripts/assets/middleEarthDAO.png"),
      // pass in here the address of the person who will be receiving the proceeds from sale of nfts 
      // But we won' charge people for the drop, so pass in the 0x0 address 
      // you can set this to own wallet address if we want to charge for the drop 
      primary_sale_recipient: AddressZero,
    }); 

    // this initialization returns the address of our contract 
    // use this to initialize the contract on the thirdweb sdk 
    const editionDrop = sdk.getEditionDrop(editionDropAddress);

    // get the metadata of contract 
    const metadata = await editionDrop.metadata.get();

    console.log(
      "✅ Successfully deployed editionDrop contract, address:",
      editionDropAddress,
    );
    console.log("✅ editionDrop metadata:", metadata); 
  } catch (error) {
  console.log("Failed to deploy editionDrop contract", error);
  }
})();


