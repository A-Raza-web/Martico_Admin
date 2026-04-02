import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import '../../pages/Category/CategoryManagement.css'; // Assuming styles are here

function CategoryEditDialog({ open, onClose, category, onUpdate }) {
  const [editFormData, setEditFormData] = useState({
    name: '',
    color: '',
    image: null,
    imageName: ''
  });
  const [errors, setErrors] = useState({});

  // Populate form when category changes
  useEffect(() => {
    if (category) {
      setEditFormData({
        name: category.name || '',
        color: category.color || '',
        image: category.image || null,
        imageName: ''
      });
    }
  }, [category]);

  // Input change for name/color
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // File input change
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData(prev => ({
        ...prev,
        image: file,
        imageName: file.name
      }));
      // Clear error
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!editFormData.name.trim()) newErrors.name = "Category name is required";
    if (!editFormData.color.trim()) newErrors.color = "Color is required";
    if (!editFormData.image) newErrors.image = "Category image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editFormData.image instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedCategory = {
          ...category,
          name: editFormData.name,
          color: editFormData.color,
          image: [reader.result] // backend will upload to Cloudinary
        };
        onUpdate(updatedCategory);
      };
      reader.readAsDataURL(editFormData.image);
    } else {
      const imagesArray = editFormData.image
        ? Array.isArray(editFormData.image)
          ? editFormData.image
          : [editFormData.image]
        : [];

      const updatedCategory = {
        ...category,
        name: editFormData.name,
        color: editFormData.color,
        image: imagesArray
      };
      onUpdate(updatedCategory);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Category</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <div className="form-vertical">
            <div className="form-row">
              <div className="form-field">
                <TextField
                  label="Category Name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
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
                  value={editFormData.color}
                  onChange={handleEditInputChange}
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
              <label className="form-label" htmlFor="edit-category-image">
                Category Image
              </label>
              <div className={`file-upload-area ${errors.image ? 'error' : ''}`}>
                <input
                  type="file"
                  id="edit-category-image"
                  name="image"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="file-input"
                />

                {/* Preview */}
                {editFormData.image instanceof File ? (
                  <div className="image-preview-box">
                    <img
                      src={URL.createObjectURL(editFormData.image)}
                      alt="Preview"
                      className="image-preview"
                    />
                  </div>
                ) : editFormData.image ? (
                  <div className="image-preview-box">
                    {Array.isArray(editFormData.image)
                      ? editFormData.image.map((img, idx) => (
                        <img key={idx} src={img} alt={`Current ${idx}`} className="image-preview" />
                      ))
                      : <img src={editFormData.image} alt="Current" className="image-preview" />}
                  </div>
                ) : null}

                <label htmlFor="edit-category-image" className="file-upload-label">
                  {editFormData.imageName || 'Change category image...'}
                </label>
              </div>
              {errors.image && <div className="error-text">{errors.image}</div>}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CategoryEditDialog;
