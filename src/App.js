import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers';

// ABIs
import MaterialControl from './abis/MaterialControl.json';

// Components
import Navigation from './components/Navigation';
import Toolbar from './components/Toolbar';

// Pages
import Home from './pages/Home';
import Account from './pages/Account';
import Material from './pages/Material';
import MaterialOrders from './pages/MaterialOrders';
import Fabricate from './pages/Fabricate';
import Transport from './pages/Transport';

// Environment
const materialContractAddress = process.env.REACT_APP_MATERIAL_CONTROL_ADDRESS;

const transportContractAddress = process.env.REACT_APP_TRANSPORT_CONTROL_ADDRESS;

function App() {
  const [provider, setProvider] = useState(null);
  const [materialContract, setMaterialContract] = useState(null);

  const [transportContract, setTransportContract] = useState(null);
  const [account, setAccount] = useState(null);
  
  const loadBlockchainData = async () => {
    // Connect to metamask wallet
    const provider = new Web3Provider(window.ethereum);
    setProvider(provider);

    // Request user accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAccount = accounts[0];
    setAccount(userAccount);

    // Create material control instance
    const materialContract = new ethers.Contract(materialContractAddress, MaterialControl, provider);
    setMaterialContract(materialContract);

    // Create transport control instance
    const transportContract = new ethers.Contract(transportContractAddress, FabricateControl, provider);
    setTransportContract(transportContract);
  }

  const [view, setView] = useState("home");

  return (
    <div>
      <Navigation setView={setView} view={view} account={account} />

      {/* View Rendering */}
      {view === "home" && <Home setView={setView} view={view}/>}
      {view === "account" && <Account setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account}/>}
      {view === "material" && <Material setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={materialContract}/>}
      {view === "material.orders" && <MaterialOrders setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={materialContract}/>}
      {view === "fabricate" && <Fabricate setView={setView} view={view}/>}
      {view === "transport" && <Transport setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={transportContract}/>}
    </div>

  );
}

export default App;
