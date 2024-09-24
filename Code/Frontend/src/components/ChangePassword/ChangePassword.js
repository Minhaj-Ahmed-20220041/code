import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { changePassword } from '../../api/userService';
import "./ChangePassword.css";

const ChangePassword = ({onClose}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            const data = {
                oldPassword,
                newPassword,
            };
            await changePassword(data);
            toast.success('Password changed successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            onClose();
        } catch (error) {
            toast.error(error || 'An error occurred while changing the password');
        }
    };

    return (
        <div className="change-password-modal-content">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword} className="change-password-form">
                <div className="form-input-field">
                    <label htmlFor="oldPassword">Old Password</label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        placeholder="Old Password"
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-input-field">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        placeholder="New Password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-input-field">
                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};


export default ChangePassword;
