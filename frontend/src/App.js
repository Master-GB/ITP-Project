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






function App() {
  return (
    <Routes>
      <Route path="/*" element={< UserLayout/>}/>
    </Routes>
  );
}

export default App;
