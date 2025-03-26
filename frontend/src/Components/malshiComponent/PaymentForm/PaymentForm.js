import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PaymentForm.css';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || value;
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 2) {
        setFormData({ ...formData, [name]: cleaned });
      } else {
        const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validate form data
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }
      
      // Send payment data to backend
      const response = await axios.post('/api/payments', formData);
      
      if (response.data.success) {
        setSuccess(true);
        // Clear form
        setFormData({
          amount: '',
          cardName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          email: ''
        });
        
        // Redirect to thank you page after 2 seconds
        setTimeout(() => {
          navigate('/thank-you');
        }, 2000);
      } else {
        setError(response.data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const validateForm = () => {
    // Basic validation
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (!formData.cardName) {
      setError('Please enter the name on card');
      return false;
    }
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!formData.expiryDate || !formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (!formData.cvv || !formData.cvv.match(/^\d{3}$/)) {
      setError('Please enter a valid 3-digit CVV');
      return false;
    }
    
    if (!formData.email || !formData.email.match(/^\S+@\S+\.\S+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  return (
    <div className="payment-container">
      <h2>Support Our Food Redistribution Initiative</h2>
      <p>Your contribution helps us reduce food waste and support those in need.</p>
      
      {success ? (
        <div className="success-message">
          <h3>Thank you for your donation!</h3>
          <p>Your payment was processed successfully. You'll be redirected shortly...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="payment-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="amount">Donation Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="card-details">
            <h3>Payment Details</h3>
            
            <div className="form-group">
              <label htmlFor="cardName">Name on Card</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              
              <div className="form-group half">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Donate Now'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;