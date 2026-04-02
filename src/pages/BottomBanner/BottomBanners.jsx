import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UploadBottomBanner from '../../component/UploadBanner/UploadBottomBanner'; // We'll create this component
import './BottomBanners.css';

function BottomBanners() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from URL path
  const activeTab = location.pathname.includes('/list') ? 'list' : 'upload';

  const handleTabChange = (tab) => {
    if (tab === 'upload') {
      navigate('/bottom-banners/upload');
    } else {
      navigate('/bottom-banners/list');
    }
  };

  // Sample data for bottom banners
  const bottomBanners = [
    {
      id: 1,
      image: 'https://api.spicezgold.com/download/file_1734525239704_foot.png',
      category: 'Shoes',
      subcategory: 'Running',
      position: 'Footer'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/800x100',
      category: 'Electronics',
      subcategory: 'Mobiles',
      position: 'Footer'
    }
  ];

  return (
    <div className="banners-page">
      <div className="page-header">
        <h2>Home Bottom Banner Management</h2>
        <div className="tabs">
          <button 
            className={activeTab === 'upload' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('upload')}
          >
            Upload Bottom Banner
          </button>
          <button 
            className={activeTab === 'list' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('list')}
          >
            Bottom Banner List
          </button>
        </div>
      </div>

      <div className="page-content">
        {activeTab === 'upload' && <UploadBottomBanner />}
        {activeTab === 'list' && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Bottom Banner List</div>
                <div className="card-subtitle">View and manage your uploaded bottom banners.</div>
              </div>
            </div>
            
            <div className="banners-list">
              {bottomBanners.map(banner => (
                <div key={banner.id} className="banner-item-row">
                  <div className="banner-row-image">
                    <img src={banner.image} alt="Bottom Banner" />
                  </div>
                  <div className="banner-row-content">
                    <div className="banner-row-info">
                      <span className="label">Category:</span>
                      <span className="value">{banner.category}</span>
                    </div>
                    <div className="banner-row-info">
                      <span className="label">Sub Category:</span>
                      <span className="value">{banner.subcategory}</span>
                    </div>
                    <div className="banner-row-info">
                      <span className="label">Position:</span>
                      <span className="value">{banner.position}</span>
                    </div>
                  </div>
                  <div className="banner-row-actions">
                    <Button variant="text" color="primary" size="small" startIcon={<EditOutlinedIcon />} className="edit-btn">
                      Edit
                    </Button>
                    <Button variant="text" color="error" size="small" startIcon={<DeleteOutlineIcon />} className="delete-btn">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BottomBanners;