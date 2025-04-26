import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
// import Donate from "./Components/gihanComponent/donationComponent/donateNow/donate";
// import Dashboard from "./Components/gihanComponent/donationComponent/dashboard/dashboard";
// import MyDonation from "./Components/gihanComponent/donationComponent/myDonation/myDonation";
// import Nav from "./Components/gihanComponent/donationComponent/navBar/nav";
// import Footer from "./Components/gihanComponent/donationComponent/footer/footer";
// import UpdateDonation from "./Components/gihanComponent/donationComponent/updateDonation/updateDonation";
// import MonitorPage from "./Components/gihanComponent/donationComponent/monitor/monitor";
// import OperatingManagerSidebar from "./Components/gihanComponent/operatingManager/navigationBar/navigationBar";
// import FoodDonationPage from "./Components/gihanComponent/operatingManager/donationManagement/donationManagement";
// import InventoryManagement from "./Components/gihanComponent/operatingManager/inventoryManagement/inventoryManagement";
// import PartnerCollaboration from "./Components/gihanComponent/operatingManager/partnerManagement/partnerManagement";

import Userdetails from "./Components/imalshaComponent/UserDetails/Users";
import NavigationBar from './Components/imalshaComponent/unavbar/Navigationbar';
import AddUser from './Components/imalshaComponent/AddUser/AddUser';
import UpdateUser from './Components/imalshaComponent/UpdateUser/UpdateUser';
import Login from './Components/imalshaComponent/login/Login';
import FeedbackDetails from './Components/imalshaComponent/FeedbackDetails/Feedbacks'
import FeedbackForm from './Components/imalshaComponent/feedbackform/FeedbackForm';
import UpdateFeedback from './Components/imalshaComponent/UpdateFeedback/UpdateFeedback'; 
import DashboardI from './Components/imalshaComponent/Dashboard/Dashboard';



const UserLayout=()=>(
  <div className='app-container' >
    <div className='app-content'>
    <Routes> 
    <Route path="/" element={<NavigationBar />} />
        <Route path="/userdetails" element={<Userdetails/>} />
        <Route path="/adduser" element={<AddUser/>} />
        <Route path="/userdetails/:id" element={<UpdateUser/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/feedback'element={<FeedbackDetails/>}/>   
        <Route path='/feedbackForm'element={<FeedbackForm/>}/>
        <Route path='/feedback/:id'element={<FeedbackDetails/>}/>
        <Route path='/updateFeedback/:id' element={<UpdateFeedback />} />
        <Route path="/dashbord" element={<DashboardI/>}/>
 
</Routes>
     </div>
    </div>
)


// const DonorLayout = () => (
//   <div className="page-container">
//     <Nav />
//     <div className="page-content">
//       <Routes>
//         <Route path="/" exact element={<Dashboard />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/donate" element={<Donate />} />
//         <Route path="/myDonate" element={<MyDonation />} />
//         <Route path="/myDonate/:id" element={<UpdateDonation />} />
//         <Route path="/monitor" element={<MonitorPage />} />
//       </Routes>
//     </div>
//     <Footer />
//   </div>
// );

// const OperatingManagerLayout = () => (
//   <div className="operating-manager-container">
//     <OperatingManagerSidebar />
//     <div className="operating-manager-content">
//       <Routes>
//          <Route path="/foodManagement" element = {<FoodDonationPage/>}/>
//          <Route path ="/inventoryManagement" element={<InventoryManagement/>}/>
//          <Route path ="/partnerManagement" element={<PartnerCollaboration/>}/>
//       </Routes>
//     </div>
//   </div>
// );

function App() {
  return (

      <Routes>
        {/* <Route path="/jkj/*" element={<OperatingManagerLayout />} />
        <Route path="/jh/*" element={<DonorLayout />} />  */}
        <Route path="/*" element={<UserLayout/>}/>
      </Routes>
  );
}

export default App;