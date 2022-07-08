import sdk from './1-initialize-sdk';
import { readFileSync } from 'fs'; 

const editionDrop = sdk.getEditionDrop("INSERT_EDITION_DROP_ADDRESS");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Middle Earth Map",
        description: "This NFT will give you access to MiddleEarthDAO!",
        image: readFileSync(""),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.log("Failed to create the new NFT", error); 
  }
})();

