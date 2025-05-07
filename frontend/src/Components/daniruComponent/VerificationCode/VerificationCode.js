import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerificationCode.css';
import { FaKey, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const allowedCodes = [
  "462722", "568903", "675433", "567483", "754678",
  "196875", "546786", "089507", "456889", "467865"
];

const VerificationCode = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data exists in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      setError('User information not found. Please try logging in again.');
    }
  }, []);

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name=code-${index + 1}]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=code-${index - 1}]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setError('Please enter the complete verification code');
      setIsVerifying(false);
      return;
    }

    if (allowedCodes.includes(code)) {
      navigate('/login');
    } else {
      setError('Invalid verification code');
      setVerificationCode(['', '', '', '', '', '']);
    }
    setIsVerifying(false);
  };

  return (
    <div className="verification-container" style={{ 
      backgroundImage: `url(${process.env.PUBLIC_URL}/Resources/daniruRes/cc.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <motion.div 
        className="verification-form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="verification-header">
          <div className="verification-icon-container">
            <FaKey className="verification-icon" />
          </div>
          <h2 className="verification-title">Verify Your Confirmation</h2>
          <p className="verification-subtitle">
            Please enter the verification code sent to your email address
          </p>
        </div>

        <form onSubmit={handleSubmit} className="verification-form">
          <div className="verification-inputs">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                type="text"
                name={`code-${index}`}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="verification-input"
                maxLength="1"
                autoComplete="off"
                disabled={isVerifying}
              />
            ))}
          </div>

          {error && (
            <motion.p 
              className="verification-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button 
            type="submit" 
            className="verification-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify Confirmation'}
          </motion.button>

          <div className="verification-footer">
            <p className="verification-footer-text">
              Haven't received the code? Please check your spam/junk folder.
            </p>
            <p className="verification-footer-text">
              If you still don't see the email, please contact support.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VerificationCode;
