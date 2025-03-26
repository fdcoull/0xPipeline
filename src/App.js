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
import MaterialControl from './abis/MaterialControl.json';
import config from './config.json';

// Components
import Navigation from './components/Navigation';
import Toolbar from './components/Toolbar';

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
  
  const loadBlockchainData = async () => {
    // Connect to metamask wallet
    const provider = new Web3Provider(window.ethereum);
    setProvider(provider);

    // Request user accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAccount = accounts[0];
    setAccount(userAccount);

    // Change this to get from env
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, MaterialControl, provider);
    setContract(contract);
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
  // useEffect(() => {
  //   loadBlockchainData();
  // }, []);

  const [view, setView] = useState("home");

  return (
    <div>
      <Navigation setView={setView} view={view} />

      {/* View Rendering */}
      {view === "home" && <Home setView={setView} view={view}/>}
      {view === "account" && <Account setView={setView} view={view}/>}
      {view === "material" && <Material setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account}/>}
      {view === "fabricate" && <Fabricate setView={setView} view={view}/>}
      {view === "transport" && <Transport setView={setView} view={view}/>}
    </div>

  );
}

export default App;
