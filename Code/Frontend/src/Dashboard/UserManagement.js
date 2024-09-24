import React, { useEffect, useState } from 'react';
import './UserManagement.css';
import { toast } from 'react-toastify';
import { getUserList, deleteUser, makeAdmin, removeAdmin } from '../api/userService';
import Modal from '../components/Modal/Modal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const closeDeleteModal = () => setConfirmDeleteModal(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserList();
        setUsers(response);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (user) => {
    setConfirmDeleteModal(true);
    setSelectedUser(user);
  };

  const handleConfirmDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
      setConfirmDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  }


  const handlePromoteUser = async (userId) => {
    try {
      await makeAdmin(userId);
      setUsers(users.map(user => user._id === userId ? { ...user, role: 'admin' } : user));
      toast.success('User promoted to admin successfully');
    } catch (error) {
      toast.error('Failed to promote user');
    }
  };

  const handleDemoteUser = async (userId) => {
    try {
      await removeAdmin(userId);
      setUsers(users.map(user => user._id === userId ? { ...user, role: 'user' } : user));
      toast.success('User demoted successfully');
    } catch (error) {
      toast.error('Failed to demote user');
    }
  };

  return (
    <div className="user-management-container">
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>

                  {user.role === 'customer' || user.role === 'user' ? (
                    <button
                      onClick={() => handlePromoteUser(user._id)}
                      className="promote-btn"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDemoteUser(user._id)}
                      className="demote-btn"
                    >
                      Remove Admin
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {confirmDeleteModal && (
        <Modal isOpen={confirmDeleteModal} onClose={closeDeleteModal}>
          <div className="confirm-delete-modal-content">
            <h4>Are you sure you want to delete the user?</h4>
            <div className="delete-modal-buttons">
              <button className="cancel-button" onClick={closeDeleteModal}>
                Cancel <i className="fa fa-ban"></i>
              </button>
              <button className="confirm-button" onClick={() => handleConfirmDelete(selectedUser._id)}>
                Delete <i className="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;
