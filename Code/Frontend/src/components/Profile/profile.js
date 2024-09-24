import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './profile.css';
import { getProfile, editProfile } from '../../api/userService';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    billingInfo: {
      fullName: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    paymentInfo: {
      cardNumber: '',
      nameInCard: '',
      expiryDate: '',
      cvv: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response);
      } catch (error) {
        toast.error('Failed to load profile information');
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    if (keys.length === 1) {
      setProfile({ ...profile, [name]: value });
    } else {
      setProfile({
        ...profile,
        [keys[0]]: {
          ...profile[keys[0]],
          [keys[1]]: value
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editProfile(profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile information');
    }
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Billing Information</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="billingInfo.fullName"
              value={profile.billingInfo?.fullName || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="billingInfo.phoneNumber"
              value={profile.billingInfo?.phoneNumber || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="billingInfo.address"
              value={profile.billingInfo?.address || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="billingInfo.city"
              value={profile.billingInfo?.city || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="billingInfo.state"
              value={profile.billingInfo?.state || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="billingInfo.country"
              value={profile.billingInfo?.country || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="billingInfo.zipCode"
              value={profile.billingInfo?.zipCode || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Payment Information</h2>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="paymentInfo.cardNumber"
              value={profile.paymentInfo?.cardNumber || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Name on Card</label>
            <input
              type="text"
              name="paymentInfo.nameInCard"
              value={profile.paymentInfo?.nameInCard || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              name="paymentInfo.expiryDate"
              value={profile.paymentInfo?.expiryDate || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              name="paymentInfo.cvv"
              value={profile.paymentInfo?.cvv || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="save-btn">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
