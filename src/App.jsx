import { useAddress, useMetamask } from '@thirdweb-dev/react'; 

const App = () => {
  // Using the hooks from thirdweb 
  const address = useAddress(); 
  const connectWithMetamask = useMetamask(); 
  console.log("👋 Address:", address);

  return (
    <div className="landing">
      <h1>Welcome to My DAO</h1>
    </div>
  );
};

export default App;
