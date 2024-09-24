import React, { useState } from 'react';
import "./EditProductForm.css"

const EditProductForm = ({ product, onUpdate }) => {
  const [productInfo, setProductInfo] = useState(product);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState(product.images);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'colors') {
      setProductInfo((prevState) => ({
        ...prevState,
        colors: value.split(',').map(colors => colors.trim()),
      }));
    } else if (name.includes('specifications.')) {
      const specName = name.split('.')[1];
      setProductInfo((prevState) => ({
        ...prevState,
        specifications: {
          ...prevState.specifications,
          [specName]: value,
        },
      }));
    } else {
      setProductInfo({ ...productInfo, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    setNewImages((prevImages) => [...prevImages, ...selectedFiles]);
    setImagePreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  const handleDeleteImage = (index) => {
    if (index < productInfo.images.length) {
      // If the image being deleted is from the old images (product.images)
      setProductInfo((prevInfo) => ({
        ...prevInfo,
        images: prevInfo.images.filter((_, i) => i !== index),
      }));
    } else {
      // If the image being deleted is from the newly added images (newImages)
      const newIndex = index - productInfo.images.length; // Adjust index for newImages
      setNewImages((prevImages) => prevImages.filter((_, i) => i !== newIndex));
    } setImagePreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setProductInfo((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      availability: {
        ...prevInfo.availability,
        quantity: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onUpdate(productInfo, newImages);
  };

  return (
    <div className="edit-product-modal-content">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-product-form-fields">
          <div className="product-basic-info-elements element-box">
            <h4>Basic Info</h4>
            <div className="form-input-field">
              <label htmlFor="name">Product Title</label>
              <input
                type="text"
                name="name"
                id="name"
                value={productInfo.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="inline-elements">
              <div className="form-input-field">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  value={productInfo.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-input-field category">
                <label htmlFor="category">Category</label>
                <select
                  name="category"
                  id="category"
                  value={productInfo.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="smartphone">Smartphone</option>
                  <option value="laptop">Laptop</option>
                  <option value="smartwatch">Smartwatch</option>
                </select>
              </div>
            </div>
            <div className="inline-elements">
              <div className="form-input-field">
                <label htmlFor="price">Product Price($)</label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  value={productInfo.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-input-field">
                <label htmlFor="quantity">Product Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={productInfo.availability.quantity}
                  onChange={handleQuantityChange}
                  required
                />
              </div>
            </div>

            <div className="form-input-field checkbox-wrapper">
              <input
                type="checkbox"
                className="sc-gJwTLC ikxBAC"
                name="isFeatured"
                id="isFeatured"
                checked={productInfo.isFeatured}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="isFeatured">Feature this product</label>
            </div>

            <div className="form-input-field product-image-upload">
              <div className="image-previews">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="image-preview-container">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeleteImage(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                id="file-upload"
                className="file-input"
                onChange={handleImageChange}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                + Add Images
              </label>
            </div>

            <div className="form-input-field">
              <label htmlFor="description">Product Description</label>
              <textarea
                name="description"
                id="description"
                value={productInfo.description}
                onChange={handleInputChange}
                rows="20"
                required
              ></textarea>
            </div>
          </div>

          <div className="product-specification-elements element-box">
            <h4>Specifications</h4>

            <div className="form-input-field">
              <label htmlFor="specifications.processor">Processor</label>
              <input
                type="text"
                name="specifications.processor"
                id="specifications.processor"
                value={productInfo.specifications.processor}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="specifications.battery">Battery (mAH)</label>
              <input
                type="text"
                name="specifications.battery"
                id="specifications.battery"
                value={productInfo.specifications.battery}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="specifications.display">Display</label>
              <input
                type="text"
                name="specifications.display"
                id="specifications.display"
                value={productInfo.specifications.display}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="specifications.storage">Storage (GB)</label>
              <input
                type="text"
                name="specifications.storage"
                id="specifications.storage"
                value={productInfo.specifications.storage}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="specifications.memory">Memory (GB)</label>
              <input
                type="text"
                name="specifications.memory"
                id="specifications.memory"
                value={productInfo.specifications.memory}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="specifications.frontCamera">Front Camera (MP)</label>
              <input
                type="text"
                name="specifications.frontCamera"
                id="specifications.frontCamera"
                value={productInfo.specifications.frontCamera}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="specifications.rearCamera">Rear Camera (MP)</label>
              <input
                type="text"
                name="specifications.rearCamera"
                id="specifications.rearCamera"
                value={productInfo.specifications.rearCamera}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="specifications.operatingSystem">Operating System</label>
              <input
                type="text"
                name="specifications.operatingSystem"
                id="specifications.operatingSystem"
                value={productInfo.specifications.operatingSystem}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="specifications.wifi">Wifi</label>
              <input
                type="text"
                name="specifications.wifi"
                id="specifications.wifi"
                value={productInfo.specifications.wifi}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="specifications.bluetooth">Bluetooth</label>
              <input
                type="text"
                name="specifications.bluetooth"
                id="specifications.bluetooth"
                value={productInfo.specifications.bluetooth}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="product-other-info-elements element-box">
            <h4>Other Info</h4>

            <div className="form-input-field">
              <label htmlFor="colors">Color</label>
              <input
                type="text"
                id="colors"
                name="colors"
                value={productInfo.colors}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="warranty">Warranty (Months)</label>
              <input
                type="number"
                id="warranty"
                name="warranty"
                value={productInfo.warranty}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="releaseYear">Release Year</label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                value={productInfo.releaseYear}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="update-product-btn">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductForm;
