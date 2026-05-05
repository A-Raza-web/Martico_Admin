import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
const API_BASE = import.meta.env.VITE_API_URL || 'https://martico-server.vercel.app/api/orders';

const getAdminToken = () => {
  return localStorage.getItem('adminToken') || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('adminToken') || 
         sessionStorage.getItem('token');
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatCurrency = (amount) => `$${Number(amount || 0).toFixed(2)}`;

const getStatusClass = (status) => {
  const s = status?.toLowerCase();
  if (['paid', 'delivered', 'confirmed'].includes(s)) return 'status-success';
  if (['pending', 'processing'].includes(s)) return 'status-pending';
  if (['cancelled', 'refunded', 'failed'].includes(s)) return 'status-failed';
  return 'status-pending';
};
const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    paid: 'Paid',
    unpaid: 'Unpaid',
    refunded: 'Refunded',
  };
  return labels[status] || status;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('q', searchQuery);
      params.append('page', page);
      params.append('limit', 10);
      const token = getAdminToken();
      console.log("Sending Token:", token);
      const res = await fetch(`${API_BASE}/admin/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setOrders(json.data);
        setTotalPages(json.pagination?.pages || 1);
      } else {
        setError(json.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchOrders();
    }, 400);
    return () => clearTimeout(debounce);
  }, [statusFilter, searchQuery, page]);

  return (
    <div className="card table-card">
      <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
        <div>
          <div className="card-title">Orders Management</div>
          <div className="card-subtitle">Viewing all customer transactions</div>
        </div>
        
        <div className="table-actions" style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search by Order#, Email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            sx={{ minWidth: 250, flexGrow: 1 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <CircularProgress size={30} />
        </div>
      ) : error ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#d32f2f' }}>
          <p>{error}</p>
          <Button variant="outlined" onClick={fetchOrders}>Try Again</Button>
        </div>
      ) : (
        <>
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <div className="table">
              <div className="table-header" style={{ gridTemplateColumns: '1.2fr 2fr 1fr 0.8fr 1fr 1fr' }}>
                <span>Order ID</span>
                <span>Customer Info</span>
                <span>Date</span>
                <span>Items</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              {orders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>No matches found.</div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="table-row"
                    style={{ gridTemplateColumns: '1.2fr 2fr 1fr 0.8fr 1fr 1fr', cursor: 'pointer' }}
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    <span style={{ fontWeight: 600, color: '#1976d2' }}>{order.orderNumber || 'N/A'}</span>
                    <span style={{ fontSize: '0.9rem' }}>
                        {order.contact?.email || order.shippingAddress?.fullName}
                    </span>
                    <span>{formatDate(order.createdAt)}</span>
                    <span>{order.items?.length || 0}</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(order.totalAmount)}</span>
                    <span className={`status ${getStatusClass(order.fulfillmentStatus)}`}>
                      {getStatusLabel(order.fulfillmentStatus)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(e, value) => setPage(value)} 
                color="primary" 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
