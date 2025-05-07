import React from "react";
import { FaBoxOpen, FaListOl, FaCubes, FaTape, FaCheckCircle } from "react-icons/fa";
import "./PackingInstructions.css"; // updated import
import VolunteerPNav from "./VolunteerPNav";
import Home from "../VolunteerCDashboard";
import HomeFooter from "../Home/HomeFooter"; // updated import

const steps = [
  {
    icon: <FaBoxOpen className="step-icon" />, title: "Prepare Materials", desc: "Ensure all the materials are ready. You will need boxes, packing tape, bubble wrap, and any other protective material."
  },
  {
    icon: <FaListOl className="step-icon" />, title: "Organize Items", desc: "Organize all items that need to be packed. Make sure fragile items are separated from others."
  },
  {
    icon: <FaCubes className="step-icon" />, title: "Start Packing", desc: "Begin packing items into boxes. Use bubble wrap and other protective materials for fragile items."
  },
  {
    icon: <FaTape className="step-icon" />, title: "Seal and Label", desc: "Once all items are packed, seal the boxes securely with tape. Label each box clearly with its contents."
  },
  {
    icon: <FaCheckCircle className="step-icon" />, title: "Final Check", desc: "Perform a final check to make sure nothing has been missed. Ensure all boxes are securely sealed and labeled."
  }
];

const PackingInstructions = () => {
  return (
    <div>
    <div className="to-packinginstructions-bg">
      <VolunteerPNav />
      <br/>
      <div className="to-packinginstructions-container">
        <h1 className="to-packinginstructions-header-modern">
          <FaBoxOpen style={{marginRight: 10, color: '#1abc9c'}} />
          Packing Instructions
        </h1>
        <div className="to-packinginstructions-steps">
          {steps.map((step, idx) => (
            <div className="to-packinginstructions-card" key={idx}>
              <div className="step-badge">{idx + 1}</div>
              {step.icon}
              <h2 className="to-packinginstructions-subheader-modern">{step.title}</h2>
              <p className="to-packinginstructions-paragraph-modern">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <HomeFooter />
    </div>
  );
};

export default PackingInstructions;
