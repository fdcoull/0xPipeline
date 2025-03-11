import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers';

// Components - For page sections
// import Navigation from './components/Navigation'

// ABIs
// import Pipeline from './abis/Pipeline.json'

// Config
// import config from './config.json'

// Test contract
import Test from './abis/Test.json';
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  
  const loadBlockchainData = async () => {
    // Connect to metamask wallet
    const provider = new Web3Provider(window.ethereum);
    setProvider(provider);

    // Get network and set contract
    const network = await provider.getNetwork();
    const contractAddress = config[network.chainId].test.address;
    const contract = new ethers.Contract(contractAddress, Test, provider);
    setContract(contract);

    // Get name variable from contract
    const name = await contract.name();
    setName(name);
  }

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <h2>Welcome to 0xPipeline!</h2>
      <h3>Contract name: {name}</h3>
    </div>
  );
}

export default App;
