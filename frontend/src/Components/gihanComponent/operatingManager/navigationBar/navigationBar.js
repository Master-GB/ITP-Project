import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navigationBar.css';
import SignOutOP from '../signOutOP/signOutOP';

import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import RequestIcon from '@mui/icons-material/RequestQuote';
import PartnersIcon from '@mui/icons-material/Handshake';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'; // Added Volunteer Icon
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const OperatingManagerSidebar = () => {
  const [showSignOut, setShowSignOut] = useState(false);
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/opl/dashboard' },
    { name: 'Inventory', icon: <InventoryIcon />, path: '/opl/inventoryManagement' },
    { name: 'Food Donation', icon: <RequestIcon />, path: '/opl/foodManagement' },
    { name: 'Partner Collaboration', icon: <PartnersIcon />, path: '/opl/partnerManagement' },
   { name: 'Chat', icon: <ChatBubbleIcon />, path: '/opl/chatOP' }, // Changed to ChatBubbleIcon
   // { name: 'Funds', icon: <AttachMoneyIcon />, path: '/fundsManagement' }
  ];

  return (
    <div className="operating-manager-sidebar">
      <div className="sidebar-header">
        <img src="/Resources/gihanRes/donationRes/mainlogo.png" alt="Organization Logo" className="sidebar-logo" />
        <h2 className="organization-name-opm">FoodShare Network</h2>
      </div>
      
      <hr className="sidebar-divider" />
      
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="nav-link">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Bottom Section with Profile and Sign Out */}
      <div className="sidebar-bottom">
        <hr className="sidebar-divider" />
        
        {/* Profile Section */}
        <Link to="/opl/operating-manager/profile" className="profile-section-op">
          <div className="profile-avatar-op">
            <PersonIcon fontSize="medium" />
          </div>
          <div className="profile-info-op">
            <h4>Gihan Bandara</h4>
            <p>Operating Manager</p>
          </div>
        </Link>
        
        {/* Sign Out */}
      <div className="sign-out" style={{ cursor: 'pointer' }} onClick={() => setShowSignOut(true)}>
        <LogoutIcon />
        <span>Sign Out</span>
      </div>
      <SignOutOP
        open={showSignOut}
        onConfirm={() => {
          setShowSignOut(false);
          navigate('/Home');
        }}
        onCancel={() => setShowSignOut(false)}
      />
      </div>
    </div>
  );
};

export default OperatingManagerSidebar;
