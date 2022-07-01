import { AddressZero } from '@ethersproject/constants'; 
import sdk from './1-initialize-sdk';
import { readFileSync } from 'fs';

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // the collection's name
      name: "MiddleEarth Guild",
      // description for the collection 
      description: "A DAO for all creatures of Middle Earth.",
      // the image that will be held as the NFT 
      image: readFileSync(),
      // pass in here the address of the person who will be receiving the proceeds from sale of nfts 
      // But we won' charge people for the drop, so pass in the 0x0 address 
      // you can set this to own wallet address if we want to charge for the drop 
      primary_sale_recipient: AddressZero; 

    }); 
  }
} catch (error) {
  console.log("Failed to deploy editionDrop contract", error);
})();


