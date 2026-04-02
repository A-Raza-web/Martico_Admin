import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Button from '@mui/material/Button';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoadingBar from 'react-top-loading-bar';
import UploadCategory from './UploadCategory';
import CategoryDeleteDialog from '../../component/Category/CategoryDeleteDialog';
import CategoryEditDialog from '../../component/Category/CategoryEditDialog';
import './CategoryManagement.css';

function CategoryManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('/list') ? 'list' : 'upload';

  const handleTabChange = (tab) => {
    navigate(`/categories/${tab}`);
  };

  const [categories, setCategories] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  // Fetch Categories
  const fetchCategories = async () => {
    setProgress(30);
    try {
      const res = await axios.get("http://localhost:4000/api/categories");
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setProgress(100);
    }
  };

  useEffect(() => {
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

  // Edit
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setOpenEditDialog(true);
  };

  // Delete Dialog Open
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenDeleteDialog(false);
    setOpenEditDialog(false);
    setSelectedCategory(null);
  };

  // Real Delete API
  const handleConfirmDelete = async () => {
    const categoryId = selectedCategory?._id;
    handleCloseDialogs();
    setLoading(true);
    setProgress(30);
    try {
      await axios.delete(`http://localhost:4000/api/categories/${categoryId}`);
      showSnackbar("Category deleted successfully!", "error");
      fetchCategories(); // refresh list
    } catch (error) {
      console.error("Delete error:", error);
      showSnackbar("Error deleting category", "error");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  // Update Category
  const handleUpdateCategory = async (updatedCategory) => {
    handleCloseDialogs();
    setLoading(true);
    setProgress(30);
    try {
      let payload = { ...updatedCategory };

      // Convert File objects to data URL
      if (updatedCategory.image && updatedCategory.image.length) {
        payload.image = await Promise.all(updatedCategory.image.map(img => {
          if (img instanceof File) {
            return new Promise(resolve => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(img);
            });
          }
          return img;
        }));
      }


      await axios.put(`http://localhost:4000/api/categories/${updatedCategory._id}`, payload);
      showSnackbar("Category updated successfully!", "success");
      fetchCategories();

    } catch (error) {
      console.error("Update error:", error);
      showSnackbar("Error updating category", "error");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="banners-page">
      <LoadingBar
        color='var(--primary-color)'
        progress={progress}
        height={4}
        onLoaderFinished={() => setProgress(0)}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="page-header">
        <h2>Category Management</h2>
        <div className="tabs">
          <button
            className={activeTab === 'upload' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('upload')}
          >
            Upload Category
          </button>
          <button
            className={activeTab === 'list' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('list')}
          >
            Category List
          </button>
        </div>
      </div>

      <div className="page-content">
        {activeTab === 'upload' && (
          <UploadCategory
            refreshCategories={fetchCategories}
            showNotification={showSnackbar}
            setProgress={setProgress}
            setParentLoading={setLoading}
          />
        )}

        {activeTab === 'list' && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Category List</div>
                <div className="card-subtitle">
                  View and manage your product categories.
                </div>
              </div>
            </div>

            <div className="banners-list">
              {categories.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrapper">
                    <Inventory2OutlinedIcon className="empty-icon" />
                  </div>
                  <div className="empty-title">No Categories Found</div>
                  <div className="empty-subtitle">
                    Get started by uploading your first category.
                  </div>
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category._id} className="banner-item-row">
                    <div className="banner-row-image">
                      <img src={category.image?.[0]} alt={category.name} />
                    </div>

                    <div className="banner-row-content">
                      <div className="banner-row-info">
                        <span className="label">Name:</span>
                        <span className="value">{category.name}</span>
                      </div>
                      <div className="banner-row-info">
                        <span className="label">Color:</span>
                        <span
                          className="value"
                          style={{ color: category.color }}
                        >
                          {category.color}
                        </span>
                      </div>
                    </div>

                    <div className="banner-row-actions">
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => handleEditClick(category)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => handleDeleteClick(category)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <CategoryDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDialogs}
        onConfirm={handleConfirmDelete}
        categoryName={selectedCategory?.name}
      />

      <CategoryEditDialog
        open={openEditDialog}
        onClose={handleCloseDialogs}
        category={selectedCategory}
        onUpdate={handleUpdateCategory}
      />

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

export default CategoryManagement;
