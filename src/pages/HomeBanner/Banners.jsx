import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoadingBar from 'react-top-loading-bar';
import axios from "axios";
import UploadBanner from '../../component/UploadBanner/UploadBanner';
import BannerDeleteDialog from '../../component/HomeBanner/BannerDeleteDialog';
import BannerEditDialog from '../../component/HomeBanner/BannerEditDialog';
import './Banners.css';

function Banners() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from URL path
  const activeTab = location.pathname.includes('/list') ? 'list' : 'upload';

  const handleTabChange = (tab) => {
    if (tab === 'upload') {
      navigate('/banners/upload');
    } else {
      navigate('/banners/list');
    }
  };

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [banners, setBanners] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchBanners = async ({ showLoader = true } = {}) => {
    if (showLoader) {
      setProgress(30);
      setLoading(true);
    }
    try {
      const res = await axios.get("http://localhost:4000/api/banners");
      if (res.data?.success) {
        setBanners(res.data.data || []);
      } else {
        setBanners(res.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      showSnackbar("Error fetching banners", "error");
    } finally {
      if (showLoader) {
        setLoading(false);
        setProgress(100);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'list') {
      fetchBanners();
    }
  }, [activeTab]);

  const handleEditClick = (banner) => {
    setSelectedBanner(banner);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (banner) => {
    setSelectedBanner(banner);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenDeleteDialog(false);
    setOpenEditDialog(false);
    setSelectedBanner(null);
  };

  const handleConfirmDelete = async () => {
    const bannerId = selectedBanner?._id;
    handleCloseDialogs();
    if (!bannerId) return;

    setLoading(true);
    setProgress(30);
    try {
      const res = await axios.delete(`http://localhost:4000/api/banners/${bannerId}`);
      showSnackbar(res.data?.message || "Banner deleted successfully!", "success");
      await fetchBanners({ showLoader: false });
    } catch (error) {
      console.error("Delete error:", error);
      showSnackbar("Error deleting banner", "error");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const handleUpdateBanner = async (updatedBanner) => {
    const bannerId = updatedBanner?._id;
    handleCloseDialogs();
    if (!bannerId) return;

    setLoading(true);
    setProgress(30);
    try {
      const res = await axios.put(`http://localhost:4000/api/banners/${bannerId}`, {
        image: updatedBanner.image
      });
      showSnackbar(res.data?.message || "Banner updated successfully!", "success");
      await fetchBanners({ showLoader: false });
    } catch (error) {
      console.error("Update error:", error);
      showSnackbar("Error updating banner", "error");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
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
        <h2>Home Banner Management</h2>
        <div className="tabs">
          <button 
            className={activeTab === 'upload' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('upload')}
          >
            Upload Banner
          </button>
          <button 
            className={activeTab === 'list' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('list')}
          >
            Banners List
          </button>
        </div>
      </div>

      <div className="page-content">
        {activeTab === 'upload' && (
          <UploadBanner
            showNotification={showSnackbar}
            setProgress={setProgress}
            setParentLoading={setLoading}
          />
        )}
        {activeTab === 'list' && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Banners List</div>
                <div className="card-subtitle">View and manage your uploaded banners.</div>
              </div>
            </div>
            
            <div className="banners-list">
              {banners.length === 0 ? (
                <div className="empty-state">No banners found.</div>
              ) : (
                banners.map(banner => (
                  <div key={banner._id} className="banner-item-row">
                    <div className="banner-row-image">
                      <img src={banner.image} alt="Banner" />
                    </div>
                    <div className="banner-row-content">
                      <div className="banner-row-info">
                        <span className="label">Uploaded:</span>
                        <span className="value">{formatDate(banner.createdAt)}</span>
                      </div>
                    </div>
                    <div className="banner-row-actions">
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        startIcon={<EditOutlinedIcon />}
                        className="edit-btn"
                        onClick={() => handleEditClick(banner)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        className="delete-btn"
                        onClick={() => handleDeleteClick(banner)}
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

      <BannerDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDialogs}
        onConfirm={handleConfirmDelete}
        bannerId={selectedBanner?._id}
      />

      <BannerEditDialog
        open={openEditDialog}
        onClose={handleCloseDialogs}
        banner={selectedBanner}
        onUpdate={handleUpdateBanner}
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

export default Banners;
