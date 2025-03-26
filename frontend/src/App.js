import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Donate from "./Components/gihanComponent/donationComponent/donateNow/donate";
import Dashboard from "./Components/gihanComponent/donationComponent/dashboard/dashboard";
import MyDonation from "./Components/gihanComponent/donationComponent/myDonation/myDonation";
import Nav from "./Components/gihanComponent/donationComponent/navBar/nav";
import Footer from "./Components/gihanComponent/donationComponent/footer/footer";
import UpdateDonation from "./Components/gihanComponent/donationComponent/updateDonation/updateDonation";
import MonitorPage from "./Components/gihanComponent/donationComponent/monitor/monitor";
import OperatingManagerSidebar from "./Components/gihanComponent/operatingManager/navigationBar/navigationBar";
import FoodDonationPage from "./Components/gihanComponent/operatingManager/donationManagement/donationManagement";
import InventoryManagement from "./Components/gihanComponent/operatingManager/inventoryManagement/inventoryManagement";
import PartnerCollaboration from "./Components/gihanComponent/operatingManager/partnerManagement/partnerManagement";


const DonorLayout = () => (
  <div className="page-container">
    <Nav />
    <div className="page-content">
      <Routes>
        <Route path="/" exact element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/myDonate" element={<MyDonation />} />
        <Route path="/myDonate/:id" element={<UpdateDonation />} />
        <Route path="/monitor" element={<MonitorPage />} />
      </Routes>
    </div>
    <Footer />
  </div>
);

const OperatingManagerLayout = () => (
  <div className="operating-manager-container">
    <OperatingManagerSidebar />
    <div className="operating-manager-content">
      <Routes>
         <Route path="/foodManagement" element = {<FoodDonationPage/>}/>
         <Route path ="/inventoryManagement" element={<InventoryManagement/>}/>
         <Route path ="/partnerManagement" element={<PartnerCollaboration/>}/>
      </Routes>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/hh/*" element={<OperatingManagerLayout />} />
      <Route path="/*" element={<DonorLayout />} />     
    </Routes>
  );
}

export default App;