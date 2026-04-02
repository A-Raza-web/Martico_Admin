import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import './UploadBanner.css';

function UploadSlider() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    priority: 1,
    image: null,
    imageName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imageName: file.name
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Slider form submitted:', formData);
  };

  return (
    <div className="card upload-banner-card">
      <div className="card-header">
        <div>
          <div className="card-title">Upload Slider</div>
          <div className="card-subtitle">Add a new slider for your homepage carousel.</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-vertical">
        <div className="form-row">
          <div className="form-field">
            <TextField
              label="Slider Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
            />
          </div>

          <div className="form-field">
            <TextField
              label="Slider Subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <TextField
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
            >
              <MenuItem value=""><em>Select category</em></MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="home">Home & Garden</MenuItem>
              <MenuItem value="beauty">Beauty</MenuItem>
              <MenuItem value="sports">Sports</MenuItem>
              <MenuItem value="furniture">Furniture</MenuItem>
            </TextField>
          </div>

          <div className="form-field">
            <TextField
              label="Priority"
              name="priority"
              type="number"
              value={formData.priority}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              size="small"
              className="form-select-mui"
              inputProps={{ min: 1, max: 10 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="slider-image">
            Upload Image
          </label>
          <div className="file-upload-area">
            <input
              type="file"
              id="slider-image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <label htmlFor="slider-image" className="file-upload-label">
              {formData.imageName ? formData.imageName : 'Choose a slider image...'}
            </label>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" className="btn ghost">
            Cancel
          </Button>
          <Button type="submit" className="btn primary">
            Upload Slider
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UploadSlider;