import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import '../UploadBanner/UploadBanner.css';

function BannerEditDialog({ open, onClose, banner, onUpdate }) {
  const [editFormData, setEditFormData] = useState({
    image: null,
    imageName: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (banner) {
      setEditFormData({
        image: banner.image || null,
        imageName: ''
      });
      setErrors({});
    }
  }, [banner]);

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData(prev => ({
        ...prev,
        image: file,
        imageName: file.name
      }));
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

    if (!editFormData.image) {
      setErrors({ image: 'Banner image is required' });
      return;
    }

    if (editFormData.image instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedBanner = {
          ...banner,
          image: reader.result
        };
        onUpdate(updatedBanner);
      };
      reader.readAsDataURL(editFormData.image);
    } else {
      const updatedBanner = {
        ...banner,
        image: editFormData.image
      };
      onUpdate(updatedBanner);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Banner</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <div className="form-vertical">
            <div className="form-field">
              <label className="form-label" htmlFor="edit-banner-image">
                Banner Image
              </label>
              <div className={`file-upload-area ${errors.image ? 'error' : ''}`}>
                <input
                  type="file"
                  id="edit-banner-image"
                  name="image"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="file-input"
                />

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
                    <img src={editFormData.image} alt="Current" className="image-preview" />
                  </div>
                ) : null}

                <label htmlFor="edit-banner-image" className="file-upload-label">
                  {editFormData.imageName || 'Change banner image...'}
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

export default BannerEditDialog;
