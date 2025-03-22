import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Donate from "./Components/gihanComponent/donationComponent/donateNow/donate";
import Dashboard from "./Components/gihanComponent/donationComponent/dashboard/dashboard";

function App() {
  return (
    <div className="main-content">
      <React.Fragment>
        <Routes>
          <Route path="/" exact element={<Dashboard/>}/>
          <Route path ="/dashboard" element={ <Dashboard/>}/>
          <Route path ="/donate" element={<Donate/>}/>
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
