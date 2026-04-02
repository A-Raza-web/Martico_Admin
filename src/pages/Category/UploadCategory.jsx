import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import axios from "axios";
import './CategoryManagement.css';

function UploadCategory({ refreshCategories, showNotification, setProgress, setParentLoading }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    image: null,
    imageName: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imageName: file.name
      }));
      // Clear error for image
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color: color
    }));
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      color: '',
      image: null,
      imageName: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.color.trim()) newErrors.color = "Color is required";
    if (!formData.image) newErrors.image = "Category image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (setProgress) setProgress(30);
    if (setParentLoading) setParentLoading(true);

    try {
      const base64Image = await convertToBase64(formData.image);

      const payload = {
        name: formData.name,
        color: formData.color,
        image: [base64Image], // array bana do
      };

      console.log("Sending Data:", payload);

      await axios.post("http://localhost:4000/api/categories/create", payload);

      // Refresh the list and redirect
      if (showNotification) showNotification("Category uploaded successfully!", "success");
      if (refreshCategories) refreshCategories();
      navigate('/categories/list');
    } catch (error) {
      console.error("Upload error:", error);
      if (showNotification) showNotification("Error uploading category", "error");
    } finally {
      if (setParentLoading) setParentLoading(false);
      if (setProgress) setProgress(100);
    }
  };


  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  return (
    <div className="card upload-banner-card">
      <div className="card-header">
        <div>
          <div className="card-title">Upload Category</div>
          <div className="card-subtitle">Add a new product category to your store.</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-vertical">
        <div className="form-row">
          <div className="form-field">
            <TextField
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
              error={!!errors.name}
              helperText={errors.name}
            />
          </div>

          <div className="form-field">
            <TextField
              label="Category Color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
              error={!!errors.color}
              helperText={errors.color}
            />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="category-image">
            Category Image
          </label>
          <div className={`file-upload-area ${errors.image ? 'error' : ''}`}>
            <input
              type="file"
              id="category-image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {formData.image && (
              <div className="image-preview-box">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            )}
            <label htmlFor="category-image" className="file-upload-label">
              {formData.imageName ? formData.imageName : 'Choose a category image...'}
            </label>
          </div>
          {errors.image && <div className="error-text">{errors.image}</div>}
        </div>

        <div className="form-actions">
          <Button type="button" className="btn ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="btn primary">
            Upload Category
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UploadCategory;