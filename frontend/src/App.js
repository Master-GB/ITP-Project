import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";

// Imalsha's componenets
import Userdetails from "./Components/imalshaComponent/UserDetails/Users";
import NavigationBar from './Components/imalshaComponent/unavbar/Navigationbar';
import AddUser from './Components/imalshaComponent/AddUser/AddUser';
import UpdateUser from './Components/imalshaComponent/UpdateUser/UpdateUser';
import Login from './Components/imalshaComponent/login/Login';
import FeedbackForm from './Components/imalshaComponent/feedbackform/FeedbackForm';
import UpdateFeedback from './Components/imalshaComponent/UpdateFeedback/UpdateFeedback'; 
import DashboardI from './Components/imalshaComponent/Dashboard/Dashboard';
import AdminDashboard from './Components/imalshaComponent/AdminDashboard/AdminDashboard';
import FeedbackDetails from './Components/imalshaComponent/FeedbackDetails/Feedbacks';

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
import FeedbackF from './Components/gihanComponent/donationComponent/feedbackF/FeedbackForm';
import DonorProfile from './Components/gihanComponent/donationComponent/donorProfile/donorProfile';


import OperatingManagerSidebar from "./Components/gihanComponent/operatingManager/navigationBar/navigationBar";
import FoodDonationPage from "./Components/gihanComponent/operatingManager/donationManagement/donationManagement";
import InventoryManagement from "./Components/gihanComponent/operatingManager/inventoryManagement/inventoryManagement";
import PartnerCollaboration from "./Components/gihanComponent/operatingManager/partnerManagement/partnerManagement";
import OpDashboard from './Components/gihanComponent/operatingManager/opDashboard/opDashboard';
import ChatOP from './Components/gihanComponent/operatingManager/chatOP/chatOP';
import OPMProfile from './Components/gihanComponent/operatingManager/OPProfile/OPProfile';

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
import PackingInstructions from './Components/daniruComponent/VolunteerPStaff/PackingInstructions';
import Home from "./Components/daniruComponent/Home/Home";
import VolunteerRoute from "./Components/daniruComponent/VolunteerDStaff/route";
import AboutUsHome from "./Components/daniruComponent/Home/AboutUs/AboutUs";
import ContactUs from "./Components/daniruComponent/Home/ContactUs/ContactUs";
import VerificationCode from "./Components/daniruComponent/VerificationCode/VerificationCode";
import Feedback from "./Components/daniruComponent/VolunteerDStaff/Feedback";
import FeedbackP from "./Components/daniruComponent/VolunteerPStaff/FeedbackP";
import VolunteerAboutUs from "./Components/daniruComponent/VolunteerDStaff/VolunteerAboutUs";
import VolunteerContactUs from "./Components/daniruComponent/VolunteerDStaff/VolunteerContactUs";
import VolunteerPAboutUs from "./Components/daniruComponent/VolunteerPStaff/VolunteerPAboutUs";
import VolunteerPContactUs from "./Components/daniruComponent/VolunteerPStaff/VolunteerPContactUs";


// Malshi's components
import NavBarP from './Components/malshiComponent/NavBarP/NavBarP';
import FoodRequests from './Components/malshiComponent/FoodRequests/FoodRequests';
import AddRequests from './Components/malshiComponent/AddRequests/AddRequests';
import UpdateRequests from './Components/malshiComponent/UpdateRequests/UpdateRequests';
import PaymentForm from "./Components/malshiComponent/PaymentForm/PaymentForm";
import ThankYou from "./Components/malshiComponent/ThankYou/ThankYou";
import FooterP from './Components/malshiComponent/FooterP/FooterP';
import DashboardP from './Components/malshiComponent/DashboardP/DashboardP';
import PFeedback from './Components/malshiComponent/FeedBack/FeedbackP';


//Sashini's components
import Map from './Components/sashiniComponent/Map';


       

const UserLayout = () => (
  <div className='app-container'>
    <div className='app-content'>
      <Routes>
        <Route path="/" element={<NavigationBar />} />
        <Route path="/userdetails" element={<Userdetails/>} />
        <Route path="/adduser" element={<AddUser/>} />
        <Route path="/userdetails/:id" element={<UpdateUser/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/feedback' element={<FeedbackDetails/>}/>   
        <Route path='/feedbackForm' element={<FeedbackForm/>}/>
        <Route path='/feedback/:id' element={<FeedbackDetails/>}/>
        <Route path='/updateFeedback/:id' element={<UpdateFeedback />} />
        <Route path="/dashbord" element={<DashboardI/>}/>
        <Route path="/display-requests/:id" element={<UpdateRequests />} />
      </Routes>
    </div>
  </div>
);

const AdminLayout = () => (
  <div className='admin-container'>
    <div className='admin-content'>
      <Routes>
        <Route path="*" element={<AdminDashboard/>} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/userdetails" element={<Userdetails />} />
        <Route path='/feedback' element={<FeedbackDetails />} />
        <Route path="/userdetails/:id" element={<UpdateUser />} />
        <Route path='/feedback/:id' element={<FeedbackDetails />} />
        <Route path='/updateFeedback/:id' element={<UpdateFeedback />} />
        
      </Routes>
    </div>
  </div>
);


const MapLayout = () => (
  <div className="Map-container">
    <div className="Map-content">
      <Routes>
        {/* modification */}
        <Route path="/" element={<Map />} />
        <Route path="/map" element = {<Map/>}/>
        <Route path="*" element={<h1>Page Not Found</h1>} />

      </Routes>
    </div>
  </div>
);


const DonorLayout = () => (
  <div className="backgroundOp">
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
        <Route path='/feedbackForm' element={<FeedbackF/>}/>
        <Route path='/profile' element={<DonorProfile/>}/>
      </Routes>
    </div>
    <Footer />
  </div>
  </div>
);

const OperatingManagerLayout = () => (
  <div className="backgroundOp">
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
        <Route path="/profile" element={<OPMProfile />} />
      </Routes>
    </div>
  </div>
  </div>
);

const RequestsLayout = () => (
  <div className="App">
    <NavBarP/>
    <div className="main-content">
      <Routes>
        {/* <Route path="/" element={<ProfileP />} /> */}
        <Route path="/add-requests" element={<AddRequests />} />
        <Route path="/display-requests" element={<FoodRequests />} />
        <Route path="/funds" element={<PaymentForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/display-requests/:id" element={<UpdateRequests />} />
        <Route path="/dashboard" element={<DashboardP />} />
        <Route path="/pfeedback" element={<PFeedback />} />

      </Routes>
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
        <Route path="/map" element = {<Map/>}/>
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
        <Route path="/volunteerapplication" element={<VolunteerApplication />} />
        <Route path="/route" element = {<VolunteerRoute/>}/>
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/volunteeraboutus" element={<VolunteerAboutUs />} />
        <Route path="/volunteercontactus" element={<VolunteerContactUs />} />
      </Routes>
    </React.Fragment>
  </div>
);

const VolunteerPackingStaffLayout = () => (
  <div className="volunteer-delivery-staff-container">
    <React.Fragment>
      <Routes>
        <Route path="/volunteer/:volunteerName" element={<VolunteerPTask />} />
      <Route path="/volunteerapplication" element={<VolunteerApplication />} />
        <Route path="/" element={<VolunteerPStaffDashboard />} />
        <Route
          path="/volunteerpstaffdashboard"
          element={<VolunteerPStaffDashboard />}
        />
        <Route path="/volunteertask" element={<VolunteerPTask />} />
        <Route path="/packinginstructions" element={<PackingInstructions />} />
        <Route path="/feedbackp" element={<FeedbackP />} />
        <Route path="/volunteerpaboutus" element={<VolunteerPAboutUs />} />
        <Route path="/volunteerpcontactus" element={<VolunteerPContactUs />} />
      </Routes>
    </React.Fragment>
  </div>
);

const HomeLayout = () => (
  <div className="home-container">
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/volunteerapplication" element={<VolunteerApplication />}/>
        <Route path="/volunteer/:volunteerName" element={<VolunteerPTask />} />
        <Route path="/volunteerapplication" element={<VolunteerApplication />} />
        <Route path="/packinginstructions" element={<PackingInstructions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/about-us" element={<AboutUsHome />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/verificationcode" element = {<VerificationCode/>}/>
      </Routes>
    </React.Fragment>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/ul/*" element={<UserLayout />} />
      <Route path="/dl/*" element={<DonorLayout />} />
      <Route path="/opl/*" element={<OperatingManagerLayout />} />
      <Route path="/rl/*" element={<RequestsLayout />} />
      <Route path="/vcl/*" element={<VolunteerCoordinatorLayout />} />
      <Route path="/vdsl/*" element={<VolunteerDeliveryStaffLayout />} />
      <Route path="/vpsl/*" element={<VolunteerPackingStaffLayout />} />
      <Route path="/al/*" element={<AdminLayout />} />
      <Route path="/eet/*" element={<MapLayout/>} />
      <Route path="/*" element={<HomeLayout/>} />
    </Routes>
  );
}


export default App;

