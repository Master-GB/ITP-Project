import React from "react";
import "./PackingInstructions.css";
import Volunteer from "../Volunteer";
import VolunteerPNav from "./VolunteerPNav";

const PackingInstructions = () => {
  return (
    <div>
    <VolunteerPNav/>
    <div className="packinginstructions-container">
      <h1 className="packinginstructions-header">Packing Instructions</h1>
      
      <section className="packinginstructions-section">
        <h2 className="packinginstructions-subheader">Step 1: Prepare Materials</h2>
        <p className="packinginstructions-paragraph">
          Ensure all the materials are ready. You will need boxes, packing tape, bubble wrap, and any other protective material.
        </p>
      </section>
      
      <section className="packinginstructions-section">
        <h2 className="packinginstructions-subheader">Step 2: Organize Items</h2>
        <p className="packinginstructions-paragraph">
          Organize all items that need to be packed. Make sure fragile items are separated from others.
        </p>
      </section>

      <section className="packinginstructions-section">
        <h2 className="packinginstructions-subheader">Step 3: Start Packing</h2>
        <p className="packinginstructions-paragraph">
          Begin packing items into boxes. Use bubble wrap and other protective materials for fragile items.
        </p>
      </section>

      <section className="packinginstructions-section">
        <h2 className="packinginstructions-subheader">Step 4: Seal and Label</h2>
        <p className="packinginstructions-paragraph">
          Once all items are packed, seal the boxes securely with tape. Label each box clearly with its contents.
        </p>
      </section>

      <section className="packinginstructions-section">
        <h2 className="packinginstructions-subheader">Step 5: Final Check</h2>
        <p className="packinginstructions-paragraph">
          Perform a final check to make sure nothing has been missed. Ensure all boxes are securely sealed and labeled.
        </p>
      </section>
    </div>
    </div>
  );
};

export default PackingInstructions;
