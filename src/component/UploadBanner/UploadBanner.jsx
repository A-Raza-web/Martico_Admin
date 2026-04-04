import { useState } from 'react';
import Button from '@mui/material/Button'
import './UploadBanner.css';
import axios from "axios";

function UploadBanner({ showNotification, setProgress, setParentLoading }) {
  const [formData, setFormData] = useState({
    image: null,
    imageName: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imageName: file.name
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
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

  const resetForm = () => {
    setFormData({
      image: null,
      imageName: ''
    });
    setImagePreview('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      if (showNotification) showNotification("Please select an image", "error");
      return;
    }

    if (setParentLoading) setParentLoading(true);
    if (setProgress) setProgress(30);

    try {
      const base64Image = await convertToBase64(formData.image);
      if (setProgress) setProgress(60);

      const res = await axios.post("https://martico-server.vercel.app/api/banners", {
        image: base64Image
      });

      console.log("Uploaded:", res.data);
      if (showNotification) showNotification("Banner uploaded successfully!", "success");
      resetForm();
      if (setProgress) setProgress(90);
    } catch (error) {
      console.log(error);
      if (showNotification) showNotification("Upload failed", "error");
    } finally {
      if (setParentLoading) setParentLoading(false);
      if (setProgress) setProgress(100);
    }
  };

  return (
    <div className="card upload-banner-card">
      <div className="card-header">
        <div>
          <div className="card-title">Upload Banner</div>
          <div className="card-subtitle">Add a new banner for your homepage.</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-vertical">
        <div className="form-field">
          <label className="form-label" htmlFor="banner-image">
            Upload Image
          </label>
          <div className="file-upload-area">
            <input
              type="file"
              id="banner-image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview-box">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            )}
            <label htmlFor="banner-image" className="file-upload-label">
              {formData.imageName ? formData.imageName : 'Choose a banner image...'}
            </label>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" className="btn ghost" onClick={resetForm}>
            Cancel
          </Button>
          <Button type="submit" className="btn primary">
            Upload Banner
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UploadBanner;
