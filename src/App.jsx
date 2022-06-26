import { useAddress, useMetamask } from '@thirdweb-dev/react'; 

const App = () => {
  // Using the hooks from thirdweb 
  const address = useAddress(); 
  const connectWithMetamask = useMetamask(); 
  console.log("👋 Address:", address);

  // case if user has not connected their wallet 
  // let them call connectWallet 
  if (!address) {
    return (
      <div className='landing'>
        <h1>Welcome to MiddleEarthDAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your Wallet
        </button>
      </div>
    );
  }
  
  return (
    <div className="landing">
      <h1>Welcome to My DAO</h1>
    </div>
  );
};

export default App;
