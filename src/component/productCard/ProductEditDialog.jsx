import { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IoMdCloseCircle } from "react-icons/io";
import axios from 'axios';
import '../../pages/ProductList.css';

function ProductEditDialog({ open, onClose, product, onUpdate }) {
  const fileInputRef = useRef(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    oldPrice: '',
    discount: '',
    countInStock: '',
    subCategory: '',
    rating: '',
    inFeatured: false,
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/categories");
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories on mount
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/subcategories");
        if (res.data.success) {
          setSubCategories(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      }
    };
    fetchSubCategories();
  }, []);

  // Populate form when product changes
  useEffect(() => {
    if (product && open) {
      setEditFormData({
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        category: product.category?._id || product.category || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        discount: product.discount || '',
        countInStock: product.countInStock || '',
        subCategory: product.subCategory?._id || product.subCategory || '',
        rating: product.rating || '',
        inFeatured: product.inFeatured || false,
        images: product.images || []
      });
      
      // Handle images
      if (product.images && product.images.length > 0) {
        const imgs = product.images.map(img => img.url);
        setImagePreviews(imgs);
      } else {
        setImagePreviews([]);
      }
      setImageFiles([]);
      setErrors({});
    }
  }, [product, open]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    // Handle auto-calculation for price, oldPrice, and discount
    if (name === 'price' || name === 'oldPrice' || name === 'discount') {
      const newFormData = { ...editFormData, [name]: value };
      const price = parseFloat(newFormData.price) || 0;
      const oldPrice = parseFloat(newFormData.oldPrice) || 0;
      const discount = parseFloat(newFormData.discount) || 0;

      // If user enters price and oldPrice, calculate discount
      if (name === 'price' || name === 'oldPrice') {
        if (price > 0 && oldPrice > 0 && price < oldPrice) {
          const calculatedDiscount = Math.round(((oldPrice - price) / oldPrice) * 100);
          newFormData.discount = calculatedDiscount;
        }
      }
      // If user enters price and discount, calculate oldPrice
      if (name === 'price' || name === 'discount') {
        if (price > 0 && discount > 0 && discount < 100) {
          const calculatedOldPrice = (price / (1 - discount / 100)).toFixed(2);
          newFormData.oldPrice = parseFloat(calculatedOldPrice);
        }
      }
      // If user enters oldPrice and discount, calculate price
      if (name === 'oldPrice' || name === 'discount') {
        if (oldPrice > 0 && discount > 0 && discount < 100) {
          const calculatedPrice = (oldPrice * (1 - discount / 100)).toFixed(2);
          newFormData.price = parseFloat(calculatedPrice);
        }
      }

      setEditFormData(newFormData);
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editFormData.name.trim()) newErrors.name = 'Product name is required';
    if (!editFormData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!editFormData.price || editFormData.price <= 0) newErrors.price = 'Valid price is required';
    if (!editFormData.category) newErrors.category = 'Category is required';
    
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Convert images to base64 if new images were added
      let base64Images = [];
      
      if (imageFiles.length > 0) {
        base64Images = await Promise.all(
          imageFiles.map(file => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = error => reject(error);
            });
          })
        );
      }

      // Prepare the update payload
      const payload = {
        name: editFormData.name,
        description: editFormData.description,
        brand: editFormData.brand,
        category: editFormData.category,
        price: parseFloat(editFormData.price),
        countInStock: parseInt(editFormData.countInStock) || 0,
        subCategory: editFormData.subCategory || null,
        rating: parseFloat(editFormData.rating) || 0,
        inFeatured: editFormData.inFeatured,
        review: [] // Initialize empty review array
      };

      // Add images if new ones were uploaded
      if (base64Images.length > 0) {
        payload.images = base64Images;
      }

      // Make API call to update product
      const response = await axios.put(
        `http://localhost:4000/api/products/${product.id || product._id}`,
        payload
      );

      if (response.data.success) {
        // Call onUpdate callback to refresh the product list
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        onClose();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      // Show error message to user
      setErrors({
        submit: error.response?.data?.message || "Failed to update product. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="edit-product-title"
    >
      <DialogTitle id="edit-product-title">
        Edit Product
      </DialogTitle>
      <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {/* Error Message */}
        {errors.submit && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#dc2626',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {errors.submit}
          </div>
        )}
        <Stack spacing={2} sx={{ mt: 2 }}>
          {/* Product Name */}
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={editFormData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            variant="outlined"
            size="small"
            required
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={editFormData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            variant="outlined"
            size="small"
            placeholder="Detailed description of the product..."
          />

          {/* Brand and Category Row */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={editFormData.brand}
              onChange={handleInputChange}
              error={!!errors.brand}
              helperText={errors.brand}
              variant="outlined"
              size="small"
              required
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={editFormData.category}
              onChange={handleInputChange}
              error={!!errors.category}
              helperText={errors.category}
              variant="outlined"
              size="small"
              select
              required
            >
              <MenuItem value=""><em>Select category</em></MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {/* Price, Old Price and Discount Row */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={editFormData.price}
              onChange={handleInputChange}
              error={!!errors.price}
              helperText={errors.price}
              variant="outlined"
              size="small"
              required
              inputProps={{ step: '0.01' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="Old Price"
              name="oldPrice"
              type="number"
              value={editFormData.oldPrice}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              inputProps={{ step: '0.01' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="Discount (%)"
              name="discount"
              type="number"
              value={editFormData.discount}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              inputProps={{ min: 0, max: 100 }}
            />
          </Stack>

          {/* Count In Stock Row */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Count In Stock"
              name="countInStock"
              type="number"
              value={editFormData.countInStock}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
          </Stack>

          {/* Sub Category and Rating Row */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Sub Category"
              name="subCategory"
              value={editFormData.subCategory}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              select
            >
              <MenuItem value=""><em>Select sub-category</em></MenuItem>
              {subCategories.map((subCat) => (
                <MenuItem key={subCat._id} value={subCat._id}>
                  {subCat.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Rating"
              name="rating"
              type="number"
              value={editFormData.rating}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
            />
          </Stack>

          {/* Featured Toggle */}
          <FormControlLabel
            control={
              <Switch
                name="inFeatured"
                checked={editFormData.inFeatured}
                onChange={handleInputChange}
                color="primary"
              />
            }
            label="Featured Product"
            sx={{ ml: 0, cursor: 'pointer' }}
          />

          {/* Product Images */}
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Product Images
            </label>

            {imagePreviews.length === 0 ? (
              <div
                style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: '8px',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-input)',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <CloudUploadIcon sx={{ fontSize: 32, mb: 1, color: 'var(--text-muted)' }} />
                <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Click to select product images (multiple)
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '12px',
                }}
              >
                {imagePreviews.map((src, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg-input)',
                    }}
                  >
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        border: 'none',
                        borderRadius: '50%',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        padding: 0,
                      }}
                    >
                      <IoMdCloseCircle style={{ fontSize: '20px' }} />
                    </button>
                  </div>
                ))}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    minHeight: '100px',
                    backgroundColor: 'var(--bg-input)',
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <CloudUploadIcon sx={{ fontSize: 24, color: 'var(--text-muted)' }} />
                </div>
              </div>
            )}
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductEditDialog;
