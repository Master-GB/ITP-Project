import React from 'react';
import { Link } from 'react-router-dom';
import './navigationBar.css';

import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import RequestIcon from '@mui/icons-material/RequestQuote';
import PartnersIcon from '@mui/icons-material/Handshake';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'; // Added Volunteer Icon
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const OperatingManagerSidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { name: 'Inventory', icon: <InventoryIcon />, path: '/inventoryManagement' },
    { name: 'Food Donation', icon: <RequestIcon />, path: '/foodManagement' },
    { name: 'Partner Collaboration', icon: <PartnersIcon />, path: '/partnerManagement' },
    { name: 'Volunteer', icon: <VolunteerActivismIcon />, path: '/volunteersManagement' }, // New Section Added
    { name: 'Funds', icon: <AttachMoneyIcon />, path: '/fundsManagement' }
  ];

  return (
    <div className="operating-manager-sidebar">
      <div className="sidebar-header">
        <img src="/Resources/gihanRes/donationRes/mainlogo.png" alt="Organization Logo" className="sidebar-logo" />
        <h2 className="organization-name">FoodShare Network</h2>
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
        <Link to="/operating-manager/profile" className="profile-section">
          <div className="profile-avatar">
            <PersonIcon fontSize="medium" />
          </div>
          <div className="profile-info">
            <h4>Gihan Bandara</h4>
            <p>Operating Manager</p>
          </div>
        </Link>
        
        {/* Sign Out */}
        <Link to="/login" className="sign-out">
          <LogoutIcon />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
};

export default OperatingManagerSidebar;
