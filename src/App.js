import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers';

// ABIs
import MaterialControl from './abis/MaterialControl.json';
import FabricateControl from './abis/FabricateControl.json';
import TransportControl from './abis/TransportControl.json';
import Pipeline from './abis/Pipeline.json';

// Components
import Navigation from './components/Navigation';
import Toolbar from './components/Toolbar';

// Pages
import Home from './pages/Home';
import Account from './pages/Account';
import AccountMaterial from './pages/AccountMaterial';
import Material from './pages/Material';
import MaterialOrders from './pages/MaterialOrders';
import Fabricate from './pages/Fabricate';
import FabricateBOMs from './pages/FabricateBOMs';
import FabricateProducts from './pages/FabricateProducts';
import FabricateOrders from './pages/FabricateOrders';
import Transport from './pages/Transport';

// Environment
const materialContractAddress = process.env.REACT_APP_MATERIAL_CONTROL_ADDRESS;
const fabricateContractAddress = process.env.REACT_APP_FABRICATE_CONTROL_ADDRESS;
const transportContractAddress = process.env.REACT_APP_TRANSPORT_CONTROL_ADDRESS;
const pipelineContractAddress = process.env.REACT_APP_PIPELINE_ADDRESS;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [materialContract, setMaterialContract] = useState(null);
  const [fabricateContract, setFabricateContract] = useState(null);
  const [transportContract, setTransportContract] = useState(null);
  const [pipelineContract, setPipelineContract] = useState(null);
  const [account, setAccount] = useState(null);
  
  const loadBlockchainData = async () => {
    // Connect to metamask wallet
    const provider = new Web3Provider(window.ethereum);
    setProvider(provider);

    // Request user accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAccount = accounts[0];
    setAccount(userAccount);

    const signer = provider.getSigner();
    setSigner(signer);

    // Create material control instance
    const materialContract = new ethers.Contract(materialContractAddress, MaterialControl, signer);
    setMaterialContract(materialContract);

    // Create fabricate control instance
    const fabricateContract = new ethers.Contract(fabricateContractAddress, FabricateControl, signer);
    setFabricateContract(fabricateContract);

    // Create transport control instance
    const transportContract = new ethers.Contract(transportContractAddress, TransportControl, signer);
    setTransportContract(transportContract);

    // Create pipeline instance
    const pipelineContract = new ethers.Contract(pipelineContractAddress, Pipeline, signer);
    setPipelineContract(pipelineContract);
  }

  const [view, setView] = useState("home");

  return (
    <div>
      <Navigation setView={setView} view={view} account={account} />

      {/* View Rendering */}
      {view === "home" && <Home setView={setView} view={view}/>}
      {view === "account" && <Account setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} pipelineContract={pipelineContract}/>}
      {view === "account.material" && <AccountMaterial setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} pipelineContract={pipelineContract} contract={materialContract} signer={signer}/>}
      {view === "material" && <Material setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={materialContract}/>}
      {view === "material.orders" && <MaterialOrders setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={materialContract}/>}
      {view === "fabricate" && <Fabricate setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={fabricateContract}/>}
      {view === "fabricate.boms" && <FabricateBOMs setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={fabricateContract}/>}
      {view === "fabricate.products" && <FabricateProducts setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={fabricateContract}/>}
      {view === "fabricate.orders" && <FabricateOrders setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={fabricateContract}/>}
      {view === "transport" && <Transport setView={setView} view={view} loadBlockchainData={loadBlockchainData} account={account} contract={transportContract}/>}
    </div>

  );
}

export default App;
