import React, { useState, useEffect } from 'react';
import { getProductsun, addProduct, addBulkProducts } from '../api/productService';
import './ProductManagement.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductManagement = () => {
  const [productInfo, setProductInfo] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    category: '',
    isFeatured: false,
    image: null,
    quantity: '',
    colors: "",
    warranty: "",
    releaseYear: "",
    specifications: {
      battery: "",
      display: "",
      frontCamera: "",
      rearCamera: "",
      storage: "",
      memory: "",
      processor: "",
      operatingSystem: "",
      wifi: "",
      bluetooth: "",
    }
  });
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  const [bulkProductsFile, setBulkProductsFile] = useState(null);

  //useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const data = await getProductSun();
  //       setProducts(data);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

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

    setImages((prevImages) => [...prevImages, ...selectedFiles]);
    setImagePreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setProductInfo((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.info('Please upload at least one image.');
      return;
    }
    const formData = new FormData();
    formData.append('productInfo', JSON.stringify(productInfo));
    images.forEach((image, index) => {
      formData.append('images', image); // Use the same key for multiple files
    });
    try {
      const response = await addProduct(formData);
      setProductInfo({
        name: '',
        description: '',
        brand: '',
        price: '',
        category: '',
        isFeatured: false,
        image: null,
        quantity: '',
        colors: '',
        warranty: '',
        releaseYear: '',
        specifications: {
          battery: "",
          display: "",
          frontCamera: "",
          rearCamera: "",
          storage: "",
          memory: "",
          processor: "",
          operatingSystem: "",
          wifi: "",
          bluetooth: "",
        }
      });
      setImages([]);
      setImagePreviewUrls([]);
      toast.success('Product added successfully');
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error(`Failed to add product: ${err.data?.error}`);
    }
  };

  // const handleBulkFileChange = (e) => {
  //   setBulkProductsFile(e.target.files[0]);
  // };

  // const handleAddBulkProducts = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await addBulkProducts(bulkProductsFile);
  //     setBulkProductsFile(null);
  //     alert('Bulk products added successfully');
  //   } catch (error) {
  //     console.error('Error adding bulk products:', error);
  //     alert('Failed to add bulk products');
  //   }
  // };

  return (
    <>
      <div className="product-management-section">
        <form className="add-product-form" onSubmit={handleAddProduct}>
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
                    value={productInfo.quantity}
                    onChange={handleInputChange}
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
                  rows="28"
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
          <button type="submit">Add Product</button>
        </form >
      </div >

      {/* <div>
        <h4>Or, Add bulk products</h4>
        <form className="bulk-product-form" onSubmit={handleAddBulkProducts}>
          <input type="file" name="bulkProducts" onChange={handleBulkFileChange} required />
          <button type="submit">Add Bulk Products</button>
        </form>
      </div> */}


      {/*<h3>Existing Products</h3>
       <ul>
        {products?.map((product) => (
          <li key={product.id}>
            {product.title} - {product.price}
          </li>
        ))}
      </ul> */}
    </ >
  );
};

export default ProductManagement;
