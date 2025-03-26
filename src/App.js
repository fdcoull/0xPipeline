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

// Environment
const contractAddress = process.env.REACT_APP_MATERIAL_CONTROL_ADDRESS;

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

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, MaterialControl, provider);
    setContract(contract);
  }

  const [view, setView] = useState("home");

  return (
    <div>
      <Navigation setView={setView} view={view} account={account} />

      {/* View Rendering */}
      {view === "home" && <Home setView={setView} view={view}/>}
      {view === "account" && <Account setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account}/>}
      {view === "material" && <Material setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account}/>}
      {view === "fabricate" && <Fabricate setView={setView} view={view}/>}
      {view === "transport" && <Transport setView={setView} view={view}/>}
    </div>

  );
}

export default App;
