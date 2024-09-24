import React, { useState } from 'react';
import EditProductForm from './EditProductForm';

const ParentComponent = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => handleEditClick(product)}>Edit Product</button>

      {isModalOpen && (
        <EditProductForm
          product={selectedProduct}
          onUpdate={(updatedProduct) => console.log('Product updated:', updatedProduct)}
          onClose={handleCloseModal}  // Ensure this is passed correctly
        />
      )}
    </div>
  );
};

export default ParentComponent;
