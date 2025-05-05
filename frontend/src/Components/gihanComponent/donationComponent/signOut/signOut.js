import React from "react";
import "./signOut.css";

const SignOutDialog = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="signout-overlay">
      <div className="signout-dialog">
        <div className="signout-dialog-header">
          <h2>Sign Out</h2>
        </div>
        <div className="signout-dialog-body">
          <p>Are you sure you want to sign out?</p>
        </div>
        <div className="signout-dialog-actions">
          <button className="signout-btn signout-ok" onClick={onConfirm}>
            Ok
          </button>
          <button className="signout-btn signout-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutDialog;
