<<<<<<< HEAD
//import './App.css';
//import NavigationBar from "./Components/gihanComponent/donationComponent/navBar/nav"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Userdetails from "./Components/imalshaComponent/UserDetails/Users";
import NavigationBar from './Components/imalshaComponent/unavbar/Navigationbar';
import AddUser from './Components/imalshaComponent/AddUser/AddUser';
import UpdateUser from './Components/imalshaComponent/UpdateUser/UpdateUser';
import Login from './Components/imalshaComponent/login/Login';
import FeedbackDetails from './Components/imalshaComponent/FeedbackDetails/Feedbacks'
import FeedbackForm from './Components/imalshaComponent/feedbackform/FeedbackForm';
import UpdateFeedback from './Components/imalshaComponent/UpdateFeedback/UpdateFeedback'; 
import Dashboard from './Components/imalshaComponent/Dashboard/Dashboard';

     
const UserLayout=()=>(
  <div className='app-container' >
    <div classNmae='app-content'>
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
        <Route path="/dashbord" element={<Dashboard/>}/>
 
</Routes>
     </div>
    </div>
)




=======
import './App.css';
import NavigationBar from "./Components/gihanComponent/donationComponent/navBar/nav"
import Footer from './Components/gihanComponent/donationComponent/footer/footer';
>>>>>>> e9a9862c2b7ef69a5b2343d7c42b1a3ca16d6514


function App() {
  return (
<<<<<<< HEAD
    <Routes>
      <Route path="/*" element={< UserLayout/>}/>
    </Routes>
=======
  
    <div className="App">

     <NavigationBar/>
 


      <NavigationBar/>
      <div className="main-content">
        {/* Your main content goes here */}
        <h1>Welcome to the Donation Platform</h1>
        <p>This is the main content of the page.</p>
      </div>
      <Footer/>
    </div>
>>>>>>> e9a9862c2b7ef69a5b2343d7c42b1a3ca16d6514
  );
}

export default App;
