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

// Components
import Navigation from './components/Navigation';

// Pages
import Home from './pages/Home';
import Account from './pages/Account';
import Material from './pages/Material';
import Fabricate from './pages/Fabricate';
import Transport from './pages/Transport';

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
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

  // Connect to metamask wallet
  const connectHandler = async () => {
    // Get accounts array
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get first account in array
    const account = ethers.getAddress(accounts[0]);

    setAccount(account);
  }

  // Load blockchain data and hook into component
  useEffect(() => {
    loadBlockchainData();
  }, []);

  const [view, setView] = useState("home");

  return (
    <div>
      <Navigation setView={setView} view={view} />

      {/* View Rendering */}
      {view === "home" && <Home setView={setView} />}
      {view === "account" && <Account setView={setView} />}
      {view === "material" && <Material setView={setView} />}
      {view === "fabricate" && <Fabricate setView={setView} />}
      {view === "transport" && <Transport setView={setView} />}
    </div>

  );
}

export default App;
