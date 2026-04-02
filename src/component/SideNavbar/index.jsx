import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useTheme } from '../../context/ThemeContext'
import './sideNav.css'
import logo from '../../assets/logo.png'
import DashboardIcon from '@mui/icons-material/DashboardOutlined'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined'
import InventoryIcon from '@mui/icons-material/Inventory2Outlined'
import PeopleIcon from '@mui/icons-material/PeopleOutlined'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined'
import CampaignIcon from '@mui/icons-material/CampaignOutlined'
import ViewCarouselIcon from '@mui/icons-material/ViewCarouselOutlined'
import ViewSidebarIcon from '@mui/icons-material/ViewSidebarOutlined'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadlineOutlined'
import SlideshowIcon from '@mui/icons-material/SlideshowOutlined'
import CategoryIcon from '@mui/icons-material/CategoryOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import LogoutIcon from '@mui/icons-material/Logout'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', group: 'General', path: '/', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
  { id: 'orders', label: 'Orders', group: 'General', path: '/orders', icon: <ShoppingCartIcon sx={{ fontSize: 20 }} /> },
  {
    id: 'products',
    label: 'Products',
    group: 'General',
    path: '/products',
    icon: <InventoryIcon sx={{ fontSize: 20 }} />,
    children: [
      { id: 'upload-product', label: 'Upload Product', path: '/products/new' },
      { id: 'product-list', label: 'Product List', path: '/products/list' },
    ]
  },
  {
    id: 'banners',
    label: 'Home Banner',
    group: 'General',
    path: '/banners',
    icon: <ViewCarouselIcon sx={{ fontSize: 20 }} />,
    children: [
      { id: 'upload-banner', label: 'Upload Banner', path: '/banners/upload' },
      { id: 'banners-list', label: 'Banners List', path: '/banners/list' },
    ]
  },
  {
    id: 'side-banners',
    label: 'Home Side Banner',
    group: 'General',
    path: '/side-banners',
    icon: <ViewSidebarIcon sx={{ fontSize: 20 }} />,
    children: [
      { id: 'upload-side-banner', label: 'Upload Side Banner', path: '/side-banners/upload' },
      { id: 'side-banners-list', label: 'Side Banner List', path: '/side-banners/list' },
    ]
  },
  {
    id: 'bottom-banners',
    label: 'Home Btm Banner',
    group: 'General',
    path: '/bottom-banners',
    icon: <ViewHeadlineIcon sx={{ fontSize: 20 }} />,
    children: [
      { id: 'upload-bottom-banner', label: 'Upload Bottom Banner', path: '/bottom-banners/upload' },
      { id: 'bottom-banners-list', label: 'Bottom Banner List', path: '/bottom-banners/list' },
    ]
  },
  {
    id: 'sliders',
    label: 'Home Slider',
    group: 'General',
    path: '/sliders',
    icon: <SlideshowIcon sx={{ fontSize: 20 }} />,
    children: [
      { id: 'upload-slider', label: 'Upload Slider', path: '/sliders/upload' },
      { id: 'sliders-list', label: 'Slider List', path: '/sliders/list' },
    ]
  },
  {
    id: 'categories',
    label: 'Category',
    group: 'General',
    path: '/categories',
    icon: <CategoryIcon sx={{ fontSize: 20 }} />,
    children: [
      { id: 'upload-category', label: 'Upload Category', path: '/categories/upload' },
      { id: 'categories-list', label: 'Category List', path: '/categories/list' },
      { id: 'upload-sub-category', label: 'Upload Sub Category', path: '/sub-categories/upload' },
      { id: 'sub-categories-list', label: 'Sub Category List', path: '/sub-categories/list' },
    ]
  },
  { id: 'customers', label: 'Customers', group: 'General', path: '/customers', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
  { id: 'settings', label: 'Settings', group: 'General', path: '/settings', icon: <SettingsIcon sx={{ fontSize: 20 }} /> },
  { id: 'reports', label: 'Reports', group: 'Analytics', path: '/reports', icon: <AssessmentIcon sx={{ fontSize: 20 }} /> },
  { id: 'marketing', label: 'Marketing', group: 'Analytics', path: '/marketing', icon: <CampaignIcon sx={{ fontSize: 20 }} /> },
]

function SideNavbar({ sidebarOpen, setSidebarOpen }) {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedItems, setExpandedItems] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [userData, setUserData] = useState({ name: 'Guest', role: 'User' })
  const open = Boolean(anchorEl)

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUserData({
          name: parsed.name || 'User',
          email: parsed.email || '',
          phone: parsed.phone || '',
          role: parsed.role || 'Admin'
        })
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login')
  }

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const generalItems = navItems.filter((item) => item.group === 'General')
  const analyticsItems = navItems.filter((item) => item.group === 'Analytics')

  const renderNavItem = (item) => {
    if (item.children) {
      const isExpanded = expandedItems[item.id]
      const isChildActive = item.children.some(child => child.path === location.pathname)

      return (
        <div key={item.id} className="nav-group-wrapper">
          <button
            className={`nav-item ${isChildActive ? 'active-parent' : ''}`}
            onClick={() => toggleExpand(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label-flex">
              {item.label}
              <ExpandMoreIcon className={`chevron ${isExpanded ? 'expanded' : ''}`} sx={{ fontSize: 18 }} />
            </span>
          </button>

          <div className={`sub-menu ${isExpanded ? 'open' : ''}`}>
            {item.children.map(child => (
              <NavLink
                key={child.id}
                to={child.path}
                end
                className={({ isActive }) =>
                  isActive ? 'nav-item sub-item active' : 'nav-item sub-item'
                }
              >
                <span className="nav-line" />
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )
    }

    return (
      <NavLink
        key={item.id}
        to={item.path}
        className={({ isActive }) =>
          isActive ? 'nav-item active' : 'nav-item'
        }
      >
        <span className="nav-icon">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    )
  }

  return (
    <>
      {/* Floating Toggle Button - shifts position based on sidebar state */}
      <Button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        sx={{
          position: 'fixed',
          left: sidebarOpen ? 'auto' : '20px',
          right: sidebarOpen ? '20px' : 'auto',
          top: '50%',
          transform: 'translateY(-50%)',
          minWidth: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: 'var(--bg-card)',
          color: 'var(--text-primary)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          border: '1px solid var(--border-color)',
          transition: 'all 0.3s ease',
          zIndex: 1200,
          '&:hover': {
            bgcolor: 'var(--primary-color)',
            color: 'white',
          }
        }}
      >
        {sidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </Button>

      <aside className={`sidebar ${sidebarOpen ? '' : 'hidden'}`}>
      <div className="sidebar-header">
        <img src={logo} alt="Martico Logo" className="logo-full" />
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-group">
          <div className="sidebar-group-label">General</div>
          {generalItems.map(renderNavItem)}
        </div>

        <div className="sidebar-group">
          <div className="sidebar-group-label">Analytics</div>
          {analyticsItems.map(renderNavItem)}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="preference-section">
          <div className="preference-item">
            <span className="pref-label">Dark Mode</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <span className="switch-slider" />
            </label>
          </div>
        </div>

        <div className="user-profile">
          <div className="avatar">
            {userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="user-details">
            <div className="user-name">{userData.name}</div>
            <div className="user-role">{userData.role}</div>
          </div>
          <Button
            size="small"
            sx={{ minWidth: 0, p: 0.5, color: 'var(--text-muted)' }}
            onClick={handleClick}
          >
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '12px',
                minWidth: 150,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid var(--border-color)',
                mt: -1
              }
            }}
          >
            <MenuItem
              component={NavLink}
              to="/profile"
              onClick={handleClose}
              sx={{ fontSize: '13px', py: 1 }}
            >
              Profile
            </MenuItem>
            <MenuItem
              component={NavLink}
              to="/user-settings"
              onClick={handleClose}
              sx={{ fontSize: '13px', py: 1 }}
            >
              Settings
            </MenuItem>
            <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
            <MenuItem
              onClick={() => {
                handleClose()
                handleLogout()
              }}
              sx={{
                fontSize: '13px',
                py: 1,
                color: 'var(--danger-text)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </aside>
    </>
  )
}

export default SideNavbar
