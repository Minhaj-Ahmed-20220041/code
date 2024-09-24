import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-button" onClick={onClose}><i className="fa fa-times"></i></button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
