
import './App.css';
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

import CreateTask from "./Components/daniruComponent/CreateTask";
import ViewTasks from "./Components/daniruComponent/ViewTasks";
import Tracking from "./Components/daniruComponent/Tracking";
import Reports from "./Components/daniruComponent/Reports";
import Volunteers from "./Components/daniruComponent/Volunteers";
import VolunteerCDashboard from "./Components/daniruComponent/VolunteerCDashboard";
import UpdateTask from "./Components/daniruComponent/UpdateTask";
import VolunteerTaskDisplay from "./Components/daniruComponent/VolunteerDStaff/VolunteerTaskDisplay";
import VolunteerTasks from "./Components/daniruComponent/VolunteerDStaff/VolunteerTasks";
import Task from "./Components/daniruComponent/Task";
import VolunteerDStaffDashboard from "./Components/daniruComponent/VolunteerDStaff/VolunteerDStaffDashboard";
import VolunteerApplication from "./Components/daniruComponent/VolunteerApplication/VolunteerApplication";
import VolunteerTask from "./Components/daniruComponent/VolunteerDStaff/VolunteerTask";


import NavBarP from './Components/malshiComponent/NavBarP/NavBarP';
import FoodRequests from './Components/malshiComponent/FoodRequests/FoodRequests';
import AddRequests from './Components/malshiComponent/AddRequests/AddRequests';
import ProfileP from './Components/malshiComponent/ProfileP/ProfileP';
import UpdateRequests from './Components/malshiComponent/UpdateRequests/UpdateRequests';
import PaymentForm from "./Components/malshiComponent/PaymentForm/PaymentForm";
import ThankYou from "./Components/malshiComponent/ThankYou/ThankYou";

import NavBarP from './Components/malshiComponent/NavBarP/NavBarP';
import FoodRequests from './Components/malshiComponent/FoodRequests/FoodRequests';
import AddRequests from './Components/malshiComponent/AddRequests/AddRequests';
import ProfileP from './Components/malshiComponent/ProfileP/ProfileP';
import UpdateRequests from './Components/malshiComponent/UpdateRequests/UpdateRequests';
import PaymentForm from "./Components/malshiComponent/PaymentForm/PaymentForm";
import ThankYou from "./Components/malshiComponent/ThankYou/ThankYou";


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


const RequestsLayout = () => (
  <div className="App">
  <NavBarP/>
  <div className="main-content">
  <React.Fragment>
      <Routes>
        <Route path="/" element={<ProfileP />} />
        <Route path="/add-requests" element={<AddRequests />} />
        <Route path="/display-requests" element={<FoodRequests />} />
        <Route path="/profile" element={<ProfileP />} />
        <Route path="/funds" element={<PaymentForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/display-requests/:id" element={<UpdateRequests />} />
      </Routes>
    </React.Fragment>
  </div>
</div>
);

const VolunteerCoordinatorLayout = () => (
  <div className="volunteer-coordinator-container">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<VolunteerCDashboard />} />
        <Route path="/dashboard" element={<VolunteerCDashboard />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/createtask" element={<CreateTask />} />
        <Route path="/volunteercdashboard" element={<VolunteerCDashboard />} />
        <Route path="/viewtasks" element={<Task />} />
        <Route path="/task/:id" element={<UpdateTask />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </React.Fragment>
  </div>
);

const VolunteerDeliveryStaffLayout = () => (
  <div className="volunteer-delivery-staff-container">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<VolunteerDStaffDashboard />} />
        <Route
          path="/volunteerdstaffdashboard"
          element={<VolunteerDStaffDashboard />}
        />
        <Route path="/volunteertask" element={<VolunteerTask />} />
        <Route path="/volunteer/:volunteerName" element={<VolunteerTask />} />
        <Route
          path="/volunteerapplication"
          element={<VolunteerApplication />}
        />
      </Routes>
    </React.Fragment>
  </div>
);

function App() {
  return (


        <Route path="/*" element={<RequestsLayout/>}/>
        <Route path="/jkj/*" element={<OperatingManagerLayout />} />
        <Route path="/jh/*" element={<DonorLayout />} /> 
       
        <Route path="/ijjj/*" element={<VolunteerCoordinatorLayout/>}/>
        <Route path="/knnjn/*" element={<VolunteerDeliveryStaffLayout/>}/>


      </Routes>
  );
}

export default App;