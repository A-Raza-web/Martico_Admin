import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UploadSlider from '../../component/UploadBanner/UploadSlider'; // We'll create this component
import './Sliders.css';

function Sliders() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from URL path
  const activeTab = location.pathname.includes('/list') ? 'list' : 'upload';

  const handleTabChange = (tab) => {
    if (tab === 'upload') {
      navigate('/sliders/upload');
    } else {
      navigate('/sliders/list');
    }
  };

  // Sample data for sliders
  const sliders = [
    {
      id: 1,
      image: 'https://via.placeholder.com/1200x400',
      title: 'Summer Sale',
      subtitle: 'Up to 50% off on summer collection',
      category: 'Clothing',
      priority: 1
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/1200x400',
      title: 'New Arrivals',
      subtitle: 'Check out our latest products',
      category: 'Electronics',
      priority: 2
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/1200x400',
      title: 'Free Shipping',
      subtitle: 'On orders over $50',
      category: 'Home & Garden',
      priority: 3
    }
  ];

  return (
    <div className="banners-page">
      <div className="page-header">
        <h2>Home Slider Management</h2>
        <div className="tabs">
          <button 
            className={activeTab === 'upload' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('upload')}
          >
            Upload Slider
          </button>
          <button 
            className={activeTab === 'list' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('list')}
          >
            Slider List
          </button>
        </div>
      </div>

      <div className="page-content">
        {activeTab === 'upload' && <UploadSlider />}
        {activeTab === 'list' && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Slider List</div>
                <div className="card-subtitle">View and manage your homepage sliders.</div>
              </div>
            </div>
            
            <div className="banners-list">
              {sliders.map(slider => (
                <div key={slider.id} className="banner-item-row">
                  <div className="banner-row-image">
                    <img src={slider.image} alt="Slider" />
                  </div>
                  <div className="banner-row-content">
                    <div className="banner-row-info">
                      <span className="label">Title:</span>
                      <span className="value">{slider.title}</span>
                    </div>
                    <div className="banner-row-info">
                      <span className="label">Subtitle:</span>
                      <span className="value">{slider.subtitle}</span>
                    </div>
                    <div className="banner-row-info">
                      <span className="label">Category:</span>
                      <span className="value">{slider.category}</span>
                    </div>
                    <div className="banner-row-info">
                      <span className="label">Priority:</span>
                      <span className="value">{slider.priority}</span>
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

export default Sliders;