import React from "react";
import "./signOut.css";

const SignOutDialog = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="donor-signO-signout-overlay">
      <div className="donor-signO-signout-dialog">
        <div className="donor-signO-signout-dialog-header">
          <h2>Sign Out</h2>
        </div>
        <div className="donor-signO-signout-dialog-body">
          <p>Are you sure you want to sign out?</p>
        </div>
        <div className="donor-signO-signout-dialog-actions">
          <button
            className="donor-signO-signout-btn donor-signO-signout-ok"
            onClick={onConfirm}
          >
            Ok
          </button>
          <button
            className="donor-signO-signout-btn donor-signO-signout-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutDialog;
