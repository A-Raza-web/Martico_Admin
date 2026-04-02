import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import InputAdornment from '@mui/material/InputAdornment'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { IoMdCloseCircle } from "react-icons/io";


function AddProductCard({ onCancel, onSubmit, initialData }) {
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    discount: '',
    category: '',
    countInStock: '',
    description: '',
    brand: '',
    rating: 0,
    subCategory: '',
    inFeatured: false
  })

  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        oldPrice: initialData.oldPrice || '',
        discount: initialData.discount || '',
        category: initialData.category?._id || initialData.category || '',
        countInStock: initialData.countInStock || '',
        description: initialData.description || '',
        brand: initialData.brand || '',
        rating: initialData.rating || 0,
        subCategory: initialData.subCategory || '',
        inFeatured: initialData.inFeatured || false
      })
      if (initialData.images && initialData.images.length > 0) {
        const imgs = initialData.images.map(img => img.url);
        setImagePreviews(imgs)
      }
    }
  }, [initialData])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/categories")
        if (res.data.success) {
          setCategories(res.data.data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/subcategories")
        if (res.data.success) {
          setSubCategories(res.data.data)
        }
      } catch (error) {
        console.error("Error fetching sub-categories:", error)
      }
    }
    fetchSubCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    
    // Handle auto-calculation for price, oldPrice, and discount
    if (name === 'price' || name === 'oldPrice' || name === 'discount') {
      const newFormData = { ...formData, [name]: value };
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
      
      setFormData(newFormData);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' || name === 'inFeatured' ? checked : value
      }))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files])

      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      oldPrice: '',
      discount: '',
      category: '',
      countInStock: '',
      description: '',
      brand: '',
      rating: 0,
      subCategory: '',
      inFeatured: false
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleCancel = () => {
    resetForm();
    // Don't navigate, just clear the form
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit(formData, imageFiles)
    }
  }

  return (
    <div className="card" style={{ maxWidth: '100%', width: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">{initialData ? 'Edit Product' : 'Product Information'}</div>
          <div className="card-subtitle">
            {initialData ? 'Update details and images for this product.' : 'Enter all details to create a new product.'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-vertical">
        {/* Product Name (Full Width) */}
        <div className="form-field">
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            required
            className="form-select-mui"
          />
        </div>

        {/* Description (Full Width) */}
        <div className="form-field">
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Detailed description of the product..."
            className="form-select-mui"
          />
        </div>

        {/* Row: Brand and Category */}
        <div className="form-row">
          <div className="form-field">
            <TextField
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
            />
          </div>
          <div className="form-field">
            <TextField
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              required
              className="form-select-mui"
            >
              <MenuItem value=""><em>Select category</em></MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>

        {/* Row: Price, Old Price and Discount */}
        <div className="form-row">
          <div className="form-field">
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              required
              className="form-select-mui"
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </div>
          <div className="form-field">
            <TextField
              label="Old Price"
              name="oldPrice"
              type="number"
              value={formData.oldPrice}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
            />
          </div>
          <div className="form-field">
            <TextField
              label="Discount (%)"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
              inputProps={{ min: 0, max: 100 }}
            />
          </div>
        </div>

        {/* Row: Stock */}
        <div className="form-row">
          <div className="form-field">
            <TextField
              label="Count In Stock"
              name="countInStock"
              type="number"
              value={formData.countInStock}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
            />
          </div>
        </div>

        {/* Row: Sub Category and Rating */}
        <div className="form-row">
          <div className="form-field">
            <TextField
              label="Sub Cat"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              select
              className="form-select-mui"
            >
              <MenuItem value="">
                <em>Select a sub-cat</em>
              </MenuItem>
              {subCategories.map((subCat) => (
                <MenuItem key={subCat._id} value={subCat._id}>
                  {subCat.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="form-field">
            <TextField
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
            />
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="form-field">
          <FormControlLabel
            control={
              <Switch
                name="inFeatured"
                checked={formData.inFeatured}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Featured Product"
            sx={{ ml: 0, cursor: 'pointer' }}
          />
        </div>

        {/* Multiple Image Upload Area */}
        <div className="form-field">
          <label className="form-label">Product Images</label>

          <div className="image-upload-wrapper" style={{ marginTop: '8px' }}>
            {imagePreviews.length === 0 ? (
              <div
                className="file-upload-area"
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
                <div className="file-upload-label">
                  Click to select product images (multiple)
                </div>
              </div>
            ) : (
              <div className="previews-grid">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={src} alt={`Preview ${index}`} />
                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={() => handleRemoveImage(index)}
                    >
                      < IoMdCloseCircle />






                    </button>
                  </div>
                ))}

                <div
                  className="file-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', padding: '8px' }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <CloudUploadIcon sx={{ fontSize: 20, color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Add More</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn primary">
            {initialData ? 'Update Product' : 'Upload Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProductCard
