<div align="center">
<img src="public/logo-full.png" alt="0xPipeline Logo" style="width:50%;">
</div>

A blockchain based supply chain management system built with Solidity and React. Use 0xP Material to document raw materials, 0xP Fabricate to record manufacturing components and BOMs, and use 0xP Transport to handle shipping.

<table align="center" style="border: none; width: 100%;">
    <tr>
        <td style="width:33%; padding: 8%;"><img src="public/0xp-material-white.png" alt="0xP Material Logo"></td>
        <td style="width:33%; padding: 8%;"><img src="public/0xp-fabricate-white.png" alt="0xP Fabricate Logo"></td>
        <td style="width:33%; padding: 8%;"><img src="public/0xp-transport-white.png" alt="0xP Transport Logo"></td>
    </tr>
</table>

## Prerequisites
* Node.js installed
* NPM (Node Package Manager) installed
* Metamask

## Setup
### Installation
* Run `git clone -b release https://github.com/fdcoull/0xPipeline.git`
* Run `npm install`
* In the root directory, create an .env file.
* Run `npx hardhat compile`

### Virtual Blockchain
* Run `npx hardhat node`
* Keep this running as it is required for deploying contracts and accessing them.

### Deploy Contracts
* Run `npx hardhat ignition deploy ignition/modules/MaterialControl.js --network localhost`
* Run `npx hardhat ignition deploy ignition/modules/FabricateControl.js --network localhost`
* Run `npx hardhat ignition deploy ignition/modules/TransportControl.js --network localhost`
* Copy each of the deployed addresses from the output into the .env file, using the following format:

`REACT_APP_MATERIAL_CONTROL_ADDRESS=`  
`REACT_APP_FABRICATE_CONTROL_ADDRESS=`  
`REACT_APP_TRANSPORT_CONTROL_ADDRESS=`  


### React Frontend
* Run `npm run start`
* Keep this running as it is required for viewing the web app.
* Follow the url returned by this command on your browser.

## Instructions
### General
* Following the link provided by `npm run start` will take you to the home page.
* From here, select either Material, Fabricate, or Transport depending on your requirements.
* Initially you will need to login by clicking the user icon at the top right.
* Click on login, login to metamask, and you will see your public address show at the bottom of the page as well as on the navbar next to the user icon.

### Material

### Fabricate

### Transport

## Changelog
### 0.14.0
* Add part fabricate feature added
* Manufacture product fabricate feature added
* Add order fabricate feature added
* Add BOM fabricate feature added

### 0.13.0
* Added list material feature
* Added add batch material feature
* Added order material feature

### 0.12.0
* Added hamburger indicator to fabricate BOM view
* Added documentation to README
* Added transport add shipment feature

### 0.11.0
* Added fabricate deploy script
* Fixed fabricate contract issue
* Added fabricate parts view
* Added fabricate products view
* Added fabricate orders view
* Added fabricate boms view

### 0.10.0
* Added transport deploy script
* Fixed transport contract issue
* Added transport view

### 0.9.0
* Added material count to contract
* Added material deploy script
* Added contract read functionality
* Added material view
* Added material orders view

### 0.8.0
* Dotenv installed
* Removed Lock default ignition file
* Add contract ABIs
* Added metamask connection
* Added login system to accounts page
* Add env reference for Material Control Address

### 0.7.0
* Fixed navbar link
* Added page menus
* Added toolbar

### 0.6.0
* React Bootstrap installed
* Bootstrap Icons installed
* Remove react default logos
* Added favico
* Bootstrap navbar added
* Account page added

### 0.5.0
* Remove Lock contract
* Remove Test contract
* Frontend structure defined
* Components and pages added
* Navbar component added
* Home page created
* Material page created
* Fabricate page created
* Transport page created

### 0.4.0
* Added logo to readme
* Transport control added
* Transport control tested

### 0.3.0
* Fabricate control added
* Fabricate control tested

### 0.2.0
* Materials control added
* Materials control tested

### 0.1.0
* Hardhat installed
* React installed
* Ethers installed
* Tests set up
