import { AddressZero } from '@ethersproject/constants'; 
import sdk from './1-initialize-sdk';
import { readFileSync } from 'fs';

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // the collection's name
      name: "MiddleEarth Guilds",
      // description for the collection 
      description: "A DAO for all creatures of Middle Earth. ",
    }); 
  }
} catch (error) {
  console.log("Failed to deploy editionDrop contract", error);
})();


