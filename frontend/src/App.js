import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";

// Imalsha's components
import Userdetails from "./Components/imalshaComponent/UserDetails/Users";
import NavigationBar from './Components/imalshaComponent/unavbar/Navigationbar';
import AddUser from './Components/imalshaComponent/AddUser/AddUser';
import UpdateUser from './Components/imalshaComponent/UpdateUser/UpdateUser';
import Login from './Components/imalshaComponent/login/Login';
import FeedbackDetails from './Components/imalshaComponent/FeedbackDetails/Feedbacks';
import FeedbackForm from './Components/imalshaComponent/feedbackform/FeedbackForm';
import UpdateFeedback from './Components/imalshaComponent/UpdateFeedback/UpdateFeedback'; 
import DashboardI from './Components/imalshaComponent/Dashboard/Dashboard';

// Gihan's components
import Donate from "./Components/gihanComponent/donationComponent/donateNow/donate";
import Dashboard from "./Components/gihanComponent/donationComponent/dashboard/dashboard";
import MyDonation from "./Components/gihanComponent/donationComponent/myDonation/myDonation";
import Nav from "./Components/gihanComponent/donationComponent/navBar/nav";
import Footer from "./Components/gihanComponent/donationComponent/footer/footer";
import UpdateDonation from "./Components/gihanComponent/donationComponent/updateDonation/updateDonation";
import MonitorPage from "./Components/gihanComponent/donationComponent/monitor/monitor";
import AboutUs from './Components/gihanComponent/donationComponent/aboutUs/aboutUs';
import Guidance from './Components/gihanComponent/donationComponent/guidance/guidance';
import Support from './Components/gihanComponent/donationComponent/support/support';
import Chat from './Components/gihanComponent/donationComponent/chat/chat';

import OperatingManagerSidebar from "./Components/gihanComponent/operatingManager/navigationBar/navigationBar";
import FoodDonationPage from "./Components/gihanComponent/operatingManager/donationManagement/donationManagement";
import InventoryManagement from "./Components/gihanComponent/operatingManager/inventoryManagement/inventoryManagement";
import PartnerCollaboration from "./Components/gihanComponent/operatingManager/partnerManagement/partnerManagement";
import OpDashboard from './Components/gihanComponent/operatingManager/opDashboard/opDashboard';
import ChatOP from './Components/gihanComponent/operatingManager/chatOP/chatOP';

// Daniru's components
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
import VolunteerPStaffDashboard from "./Components/daniruComponent/VolunteerPStaff/VolunteerPStaffDashboard";
import VolunteerPTask from "./Components/daniruComponent/VolunteerPStaff/VolunteerPTask";

// Malshi's components
import NavBarP from './Components/malshiComponent/NavBarP/NavBarP';
import FoodRequests from './Components/malshiComponent/FoodRequests/FoodRequests';
import AddRequests from './Components/malshiComponent/AddRequests/AddRequests';
import ProfileP from './Components/malshiComponent/ProfileP/ProfileP';
import UpdateRequests from './Components/malshiComponent/UpdateRequests/UpdateRequests';
import PaymentForm from "./Components/malshiComponent/PaymentForm/PaymentForm";
import ThankYou from "./Components/malshiComponent/ThankYou/ThankYou";
import PackingInstructions from './Components/daniruComponent/VolunteerPStaff/PackingInstructions';

const UserLayout = () => (
  <div className='app-container'>
    <div className='app-content'>
      <NavigationBar />
      <Routes>
        <Route path="/userdetails" element={<Userdetails />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/userdetails/:id" element={<UpdateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path='/feedback' element={<FeedbackDetails />} />
        <Route path='/feedbackForm' element={<FeedbackForm />} />
        <Route path='/feedback/:id' element={<FeedbackDetails />} />
        <Route path='/updateFeedback/:id' element={<UpdateFeedback />} />
        <Route path="/dashbord" element={<DashboardI />} />
      </Routes>
    </div>
  </div>
);

const DonorLayout = () => (
  <div className="page-container">
    <Nav />
    <div className="page-content">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/myDonate" element={<MyDonation />} />
        <Route path="/myDonate/:id" element={<UpdateDonation />} />
        <Route path="/monitor" element={<MonitorPage />} />
        <Route path = "/about-us" element ={<AboutUs/>}/>
        <Route path = "/guidance" element ={<Guidance/>}/>
        <Route path = "/support" element ={<Support/>}/>
        <Route path="/chat" element={<Chat />} />
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
        <Route path="/" element={<OpDashboard/>} />
        <Route path="/dashboard" element={<OpDashboard/>} />
        <Route path="/foodManagement" element={<FoodDonationPage />} />
        <Route path="/inventoryManagement" element={<InventoryManagement />} />
        <Route path="/partnerManagement" element={<PartnerCollaboration />} />
        <Route path="/chatOP" element={<ChatOP />} />

      </Routes>
    </div>
  </div>
);

const RequestsLayout = () => (
  <div className="App">
    <NavBarP />
    <div className="main-content">
      <Routes>
        <Route path="/" element={<ProfileP />} />
        <Route path="/add-requests" element={<AddRequests />} />
        <Route path="/display-requests" element={<FoodRequests />} />
        <Route path="/profile" element={<ProfileP />} />
        <Route path="/funds" element={<PaymentForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/display-requests/:id" element={<UpdateRequests />} />
      </Routes>
    </div>
  </div>
);

const VolunteerCoordinatorLayout = () => (
  <div className="volunteer-coordinator-container">
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
  </div>
);

const VolunteerDeliveryStaffLayout = () => (
  <div className="volunteer-delivery-staff-container">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<VolunteerDStaffDashboard />} />
        <Route
          path="/volunteerdstaffdashboard/:volunteerName"
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

const VolunteerPackingStaffLayout = () => (
  <div className="volunteer-delivery-staff-container">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<VolunteerPStaffDashboard />} />
        <Route
          path="/volunteerpstaffdashboard/:volunteerName"
          element={<VolunteerPStaffDashboard />}
        />
        <Route path="/volunteertask" element={<VolunteerPTask />} />
        <Route path="/volunteer/:volunteerName" element={<VolunteerPTask />} />
        <Route
          path="/volunteerapplication"
          element={<VolunteerApplication />}
        />
                <Route path="/packinginstructions" element={<PackingInstructions />} />

      </Routes>
    </React.Fragment>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/hh/*" element={<UserLayout />} />
      <Route path="/*" element={<DonorLayout />} />
      <Route path="/j/*" element={<OperatingManagerLayout />} />
      <Route path="/requests/*" element={<RequestsLayout />} />
      <Route path="/volunteer-coordinator/*" element={<VolunteerCoordinatorLayout />} />
      <Route path="/volunteer-delivery/*" element={<VolunteerDeliveryStaffLayout />} />
      <Route path="/volunteer-packing/*" element={<VolunteerPackingStaffLayout />} />
    </Routes>
  );
}

export default App;