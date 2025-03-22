import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Donate from "./Components/gihanComponent/donationComponent/donateNow/donate";
import Dashboard from "./Components/gihanComponent/donationComponent/dashboard/dashboard";
import MyDonation from "./Components/gihanComponent/donationComponent/myDonation/myDonation";
import Nav from "./Components/gihanComponent/donationComponent/navBar/nav";
import Footer from "./Components/gihanComponent/donationComponent/footer/footer";

function App() {
  return (

    <div className="page-container">
      <Nav/>
       <div className="page-content">
      <React.Fragment>
        <Routes>
          <Route path="/" exact element={<Dashboard/>}/>
          <Route path ="/dashboard" element={ <Dashboard/>}/>
          <Route path ="/donate" element={<Donate/>}/>
          <Route path = "/myDonate" element = {<MyDonation/>}/>
        </Routes>       
      </React.Fragment>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
