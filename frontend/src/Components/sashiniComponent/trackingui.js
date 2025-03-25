import React from 'react'
import axios from "axios";

const URL = "http://localhost:8090/trackings";

const fetchHandler = async () =>{
    return await axios.get(URL).then((res)=>res.data);
}
function Trackingui() {

  return (
    <div>
      <h1> User Details</h1>
    </div>
  );
}

export default Trackingui
