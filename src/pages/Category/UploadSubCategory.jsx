import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button'
import axios from "axios";
import './CategoryManagement.css';

function UploadSubCategory({ refreshSubCategories, showNotification, setProgress, setParentLoading }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    subCategory: ''
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/categories");
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (showNotification) showNotification("Error fetching categories", "error");
      }
    };
    fetchCategories();
  }, []);

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

  const handleCancel = () => {
    setFormData({
      category: '',
      subCategory: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.subCategory.trim()) newErrors.subCategory = "Sub category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (setProgress) setProgress(30);
    if (setParentLoading) setParentLoading(true);

    try {
      const payload = {
        category: formData.category,
        name: formData.subCategory
      };

      console.log("Sending Data:", payload);

      await axios.post("http://localhost:4000/api/subcategories/create", payload);

      // Refresh the list and redirect
      if (showNotification) showNotification("Sub Category uploaded successfully!", "success");
      if (refreshSubCategories) refreshSubCategories();
      navigate('/sub-categories/list');
    } catch (error) {
      console.error("Upload error:", error);
      if (showNotification) showNotification("Error uploading sub category", "error");
    } finally {
      if (setParentLoading) setParentLoading(false);
      if (setProgress) setProgress(100);
    }
  };

  return (
    <div className="card upload-banner-card">
      <div className="card-header">
        <div>
          <div className="card-title">Upload Sub Category</div>
          <div className="card-subtitle">Add a new sub category to your store.</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-vertical">
        <div className="form-row">
          <div className="form-field">
            <TextField
              label="Choose the Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
              select
              error={!!errors.category}
              helperText={errors.category}
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="form-field">
            <TextField
              label="Add Sub Category"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
              error={!!errors.subCategory}
              helperText={errors.subCategory}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" className="btn ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="btn primary">
            Upload Sub Category
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UploadSubCategory;
