import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs'; 

const editionDrop = sdk.getEditionDrop("0x72f0948daFC590f31f9c3F729EaaFA0147EB799e");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "The Silmarils",
        description: "This NFT will give you access to MiddleEarthDAO!",
        image: readFileSync("scripts/assets/nftSilmaril.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.log("Failed to create the new NFT", error); 
  }
})();

