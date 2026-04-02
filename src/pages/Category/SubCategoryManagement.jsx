import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Button from '@mui/material/Button';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoadingBar from 'react-top-loading-bar';
import { IoMdCloseCircle } from "react-icons/io";
import UploadSubCategory from './UploadSubCategory';
import './CategoryManagement.css';

function SubCategoryManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('/list') ? 'list' : 'upload';

  const handleTabChange = (tab) => {
    navigate(`/sub-categories/${tab}`);
  };

  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch Sub Categories
  const fetchSubCategories = async () => {
    setProgress(30);
    try {
      const res = await axios.get("http://localhost:4000/api/subcategories");
      if (res.data.success) {
        setSubCategories(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    } finally {
      setProgress(100);
    }
  };

  // Fetch Categories for reference
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

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  // Trigger loading bar on tab change
  useEffect(() => {
    setProgress(40);
    const timer = setTimeout(() => {
      setProgress(100);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Delete Sub Category
  const handleDeleteClick = async (subCategoryId) => {
    setLoading(true);
    setProgress(30);
    try {
      const res = await axios.delete(`http://localhost:4000/api/subcategories/${subCategoryId}`);
      if (res.data.success) {
        showSnackbar("Sub Category deleted successfully!", "success");
        fetchSubCategories(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      showSnackbar("Error deleting sub-category", "error");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div className="page">
      <LoadingBar
        color='var(--primary-color)'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={4}
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="page-header">
        <h2>Sub Category Management</h2>
        <div className="tabs">
          <button
            className={activeTab === 'upload' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('upload')}
          >
            Upload Sub Category
          </button>
          <button
            className={activeTab === 'list' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('list')}
          >
            Sub Category List
          </button>
        </div>
      </div>

      <div className="page-content">
        {activeTab === 'upload' && (
          <UploadSubCategory
            refreshSubCategories={fetchSubCategories}
            showNotification={showSnackbar}
            setProgress={setProgress}
            setParentLoading={setLoading}
          />
        )}

        {activeTab === 'list' && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Sub Category List</div>
                <div className="card-subtitle">
                  View and manage your product sub categories.
                </div>
              </div>
            </div>

            <div className="table-wrapper">
              {subCategories.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrapper">
                    <Inventory2OutlinedIcon className="empty-icon" />
                  </div>
                  <div className="empty-title">No Sub Categories Found</div>
                  <div className="empty-subtitle">
                    Get started by uploading your first sub category.
                  </div>
                </div>
              ) : (
                <table className="sub-category-table">
                  <thead>
                    <tr>
                      <th>Category Image</th>
                      <th>Category</th>
                      <th>Sub Categories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => {
                      const categorySubCategories = subCategories.filter(sub => {
                        // Handle both populated category object and plain ID
                        const subCategoryId = sub.category?._id || sub.category;
                        return subCategoryId === category._id;
                      });
                      return (
                        <tr key={category._id} className="category-row-single">
                          <td className="table-image">
                            {category.image && category.image[0] ? (
                              <img src={category.image[0]} alt={category.name} />
                            ) : (
                              <img src="https://via.placeholder.com/50?text=No+Image" alt="No Image" />
                            )}
                          </td>
                          <td className="table-category-name">{category.name}</td>
                          <td className="subcategory-list-cell">
                            {categorySubCategories.length > 0 ? (
                              <div className="subcategory-tags">
                                {categorySubCategories.map((subCategory) => (
                                  <div key={subCategory._id} className="subcategory-tag">
                                    <span>{subCategory.name}</span>
                                    <button
                                      className="subcategory-close-btn"
                                      onClick={() => handleDeleteClick(subCategory._id)}
                                      title="Remove sub-category"
                                    >
                                      <IoMdCloseCircle />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="empty-subcategories">No sub-categories</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SubCategoryManagement;
