import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { AiFillStar } from 'react-icons/ai';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ProductEditDialog from '../component/productCard/ProductEditDialog';
import ProductDeleteDialog from '../component/productCard/ProductDeleteDialog';
import LoadingBar from 'react-top-loading-bar';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './ProductList.css';

const ProductList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]); // Add categories state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const itemsPerPage = 8;

  // Fetch categories on mount
  useEffect(() => {
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
    fetchCategories();
  }, []);

  // Page load - fetch products
  useEffect(() => {
    fetchProducts(currentPage, searchTerm, filters.category);
    
    // Check for success message from product creation/edit
    const successMessage = searchParams.get('success');
    if (successMessage) {
      showSnackbar(decodeURIComponent(successMessage), 'success');
      // Remove the success parameter from URL
      setSearchParams({});
    }
  }, [currentPage, searchParams]);

  // Fetch products from database
  const fetchProducts = async (page = 1, search = '', category = '') => {
    setLoading(true);
    setProgress(30);
    
    try {
      setProgress(60);
      const response = await axios.get(`http://localhost:4000/api/products`, {
        params: {
          page: page,
          limit: itemsPerPage,
          search: search || undefined,
          category: category || undefined
        }
      });
      
      if (response.data.success) {
        // Transform the data to match the existing structure
        const transformedProducts = response.data.data.map(product => ({
          id: product._id,
          name: product.name,
          description: product.description || '',
          brand: product.brand || 'Unknown',
          category: product.category || null, // This will now be the full category object or null
          subCategory: product.subCategory || null, // Keep the full subCategory object for edit dialog
          subCategoryName: product.subCategory 
            ? (typeof product.subCategory === 'object' 
                ? product.subCategory.name 
                : product.subCategory)
            : 'N/A',
          price: product.price,
          oldPrice: product.oldPrice || 0,
          discount: product.discount || 0,
          countInStock: product.countInStock || 0,
          revenue: product.price * (product.countInStock || 0), // Calculate revenue
          sales: product.countInStock || 0,
          stock: product.countInStock || 0,
          rating: product.rating || 0,
          inFeatured: product.inFeatured || false,
          status: product.countInStock > 0 ? 'In Stock' : 'Out Stock',
          image: product.images && product.images.length > 0 ? product.images[0].url : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'
        }));
        
        setProducts(transformedProducts);
        setTotalProducts(response.data.pagination.total);
        setTotalPages(response.data.pagination.pages);
        setProgress(100);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProgress(100);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 300);
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    fetchProducts(1, searchTerm, filters.category);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page
    fetchProducts(1, searchTerm, value);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleMenuClick = (productId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === productId ? null : productId);
  };

  const handleEditUpdate = (updatedProduct) => {
    setProgress(30);
    console.log('Product updated:', updatedProduct);
    // Refresh the product list to show updated data
    fetchProducts(currentPage, searchTerm, filters.category);
    showSnackbar('Product updated successfully!', 'success');
    setEditDialogOpen(false);
    setProgress(100);
    setTimeout(() => setProgress(0), 300);
  };

  const handleDeleteConfirm = () => {
    setProgress(30);
    console.log('Product deleted:', selectedProduct);
    // Refresh the product list to show updated data
    fetchProducts(currentPage, searchTerm, filters.category);
    showSnackbar('Product deleted successfully!', 'error');
    setDeleteDialogOpen(false);
    setProgress(100);
    setTimeout(() => setProgress(0), 300);
  };

  // Truncate description to 4 words and add dots if longer
  const truncateToFourWords = (text) => {
    if (!text) return '';
    const words = text.split(' ').filter(word => word.trim().length > 0);
    if (words.length > 3) {
      return words.slice(0, 3).join(' ') + '…';
    }
    return text;
  };

  // Current products for display
  const currentProducts = products;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + products.length;

  return (
    <div className="banners-page">
      <LoadingBar
        color='var(--primary-color)'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={4}
      />
      {/* Header Section */}
      <div className="page-header">
        <h2>Product Management</h2>
        <div className="tabs">
          <button
            className="tab"
            onClick={() => navigate('/products/new')}
          >
            Upload Product
          </button>
          <button
            className="tab active"
            onClick={() => navigate('/products/list')}
          >
            Product List
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Product List</div>
              <div className="card-subtitle">
                Manage your products and view their status.
              </div>
            </div>
          </div>

          {/* Product Table Section */}
          <div className="product-table-card">
        {/* Table Controls */}
        <div className="table-controls">
          {/* Left side: Filter Options */}
          <div className="filter-options">
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              displayEmpty
              className="filter-select form-select-mui"
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          
          {/* Right side: Search */}
          <div className="search-wrapper">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="search-button" 
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Price</th>
                <th>Old Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr 
                  key={product.id}
                  className="product-row"
                  onMouseEnter={() => setHoveredRowId(product.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                >
                  <td>
                    <div className="product-cell">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                      <div className="product-info">
                        <div className="product-name">{truncateToFourWords(product.name)}</div>
                        {product.description && (
                          <div className="product-description">{truncateToFourWords(product.description)}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{product.brand}</td>
                  <td>
                    {product.category 
                      ? (typeof product.category === 'object' 
                          ? (product.category.name || 'N/A') 
                          : product.category)
                      : 'N/A'}
                  </td>
                  <td>{product.subCategoryName}</td>
                  <td>
                    <div className="price-cell">
                      <span className="current-price">${product.price.toFixed(2)}</span>
                    </div>
                  </td>
                  <td>
                    {product.oldPrice > 0 ? `$${product.oldPrice.toFixed(2)}` : '-'}
                  </td>
                  <td>{product.countInStock}</td>
                  <td>
                    <div className="rating-cell">
                      <AiFillStar className="star-icon" />
                      {product.rating.toFixed(1)}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${product.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className={`action-menu ${hoveredRowId === product.id ? 'visible' : ''}`}>
                      <div className="menu-container">
                        <button 
                          className="menu-btn" 
                          title="More options"
                          onClick={(e) => handleMenuClick(product.id, e)}
                        >
                          <MoreVertIcon className="menu-icon" />
                        </button>
                        {openMenuId === product.id && (
                          <div className="dropdown-menu">
                            <button 
                              className="dropdown-item edit"
                              onClick={() => handleEdit(product)}
                              title="Edit product"
                            >
                              <EditOutlinedIcon className="dropdown-icon edit-icon" />
                              <span>Edit</span>
                            </button>
                            <button 
                              className="dropdown-item delete"
                              onClick={() => handleDelete(product)}
                              title="Delete product"
                            >
                              <DeleteOutlineIcon className="dropdown-icon delete-icon" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-wrapper">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} entries
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
                disabled={loading}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Edit Dialog */}
  <ProductEditDialog 
    open={editDialogOpen} 
    onClose={() => setEditDialogOpen(false)} 
    product={selectedProduct}
    onUpdate={handleEditUpdate}
  />

  {/* Delete Dialog */}
  <ProductDeleteDialog 
    open={deleteDialogOpen} 
    onClose={() => setDeleteDialogOpen(false)} 
    productName={selectedProduct?.name}
    productId={selectedProduct?.id || selectedProduct?._id}
    onConfirm={handleDeleteConfirm}
  />
                
  <Snackbar
    open={snackbar.open}
    autoHideDuration={3000}
    onClose={handleCloseSnackbar}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  >
    <Alert
      onClose={handleCloseSnackbar}
      severity={snackbar.severity}
      variant="filled"
      sx={{ 
        width: '100%',
        bgcolor: snackbar.severity === 'error' ? '#d32f2f' : '#4caf50'
      }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
</div>
);
};

export default ProductList;
