import React from "react";
import ReactDOM from "react-dom";
import "./signOutOP.css";

const SignOutOP = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="opm-signO-signout-overlay">
      <div className="opm-signO-signout-dialog">
        <div className="opm-signO-signout-dialog-header">
          <h2>Sign Out</h2>
        </div>
        <div className="opm-signO-signout-dialog-body">
          <p>Are you sure you want to sign out?</p>
        </div>
        <div className="opm-signO-signout-dialog-actions">
          <button className="opm-signO-signout-btn opm-signO-signout-ok" onClick={onConfirm}>
            Ok
          </button>
          <button className="opm-signO-signout-btn opm-signO-signout-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignOutOP;
