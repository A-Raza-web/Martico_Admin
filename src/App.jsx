import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import SideNavbar from './component/SideNavbar'
import Dashboard from './pages/Dashboard'
import ProductForm from './pages/ProductForm'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Customers from './pages/Customers'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Marketing from './pages/Marketing'
import Banners from './pages/HomeBanner/Banners'
import SideBanners from './pages/SideBanner/SideBanners'
import BottomBanners from './pages/BottomBanner/BottomBanners'
import Sliders from './pages/Slider/Sliders'
import CategoryManagement from './pages/Category/CategoryManagement'
import SubCategoryManagement from './pages/Category/SubCategoryManagement'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import UserSettings from './pages/UserSettings'
import ProductPage from './pages/productListpage'
import ProductList from './pages/productListpage'
import './App.css'

function Topbar({ title }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>{title}</h1>
        <p>Overview of your ecommerce performance</p>
      </div>
      <div className="topbar-right">
        <div className="date-range">
          <span>18 jun 2026 - 18 feb 2026</span>
        </div>
        <Button className='export-btn' variant="text" color="inherit">Export</Button>
        <Button
          component={Link}
          to="/products/new"
          variant="contained"
          color="primary"
        >
          + Add Product
        </Button>
      </div>
    </header>
  )
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    // Check for token in localStorage or sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Dashboard'
      case '/products/list': return 'Product List'
      case '/orders': return 'Orders'
      case '/customers': return 'Customers'
      case '/reports': return 'Reports'
      case '/settings': return 'Settings'
      case '/marketing': return 'Marketing'
      case '/banners': return 'Banners'
      case '/banners/upload': return 'Upload Banner'
      case '/banners/list': return 'Banners List'
      case '/side-banners/upload': return 'Upload Side Banner'
      case '/side-banners/list': return 'Side Banner List'
      case '/bottom-banners/upload': return 'Upload Bottom Banner'
      case '/bottom-banners/list': return 'Bottom Banner List'
      case '/sliders/upload': return 'Upload Slider'
      case '/sliders/list': return 'Slider List'
      case '/categories/upload': return 'Upload Category'
      case '/categories/list': return 'Category List'
      case '/sub-categories/upload': return 'Upload Sub Category'
      case '/sub-categories/list': return 'Sub Category List'
      case '/login': return 'Login'
      case '/signup': return 'Signup'
      case '/profile': return 'User Profile'
      case '/user-settings': return 'Account Settings'
      default: return 'Dashboard'
    }
  }

  const title = getPageTitle(location.pathname)

  return (
    <ThemeProvider>
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        <ProtectedRoute>
          <div className={`dashboard ${sidebarOpen ? '' : 'sidebar-hidden'}`}>
            <SideNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="main">
              <Topbar title={title} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/categories/*" element={<CategoryManagement />} />
                  <Route path="/sub-categories/*" element={<SubCategoryManagement />} />
                  <Route path="/products/list" element={<ProductList />} />

                  <Route path="/products/new" element={<ProductForm />} />
                  <Route path="/products/:id" element={<ProductForm />} />
                  <Route path="/products/view/:id" element={<ProductPage />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="/banners/*" element={<Banners />} />
                  <Route path="/side-banners/*" element={<SideBanners />} />
                  <Route path="/bottom-banners/*" element={<BottomBanners />} />
                  <Route path="/sliders/*" element={<Sliders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/user-settings" element={<UserSettings />} />
                </Routes>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      )}
    </ThemeProvider>
  )
}

export default App
