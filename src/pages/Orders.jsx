import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';

const API_BASE = import.meta.env.VITE_API_URL || 'https://martico-server.vercel.app/api';
const getAdminToken = () =>
  localStorage.getItem('adminToken') ||
  localStorage.getItem('token') ||
  sessionStorage.getItem('adminToken') ||
  sessionStorage.getItem('token');

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatCurrency = (amount) => {
  return `$${Number(amount || 0).toFixed(2)}`;
};

const getStatusClass = (status) => {
  if (status === 'paid' || status === 'delivered' || status === 'confirmed') return 'status-success';
  if (status === 'pending' || status === 'processing') return 'status-pending';
  if (status === 'cancelled' || status === 'refunded' || status === 'failed') return 'status-failed';
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
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('q', searchQuery);

      const token = getAdminToken();
      const res = await fetch(`${API_BASE}/orders/admin/orders?${params.toString()}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setOrders(json.data);
        } else {
          setError('Failed to fetch orders');
        }
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(debounce);
  }, [statusFilter, searchQuery]);

  return (
    <div className="card table-card">
      <div className="card-header">
        <div>
          <div className="card-title">Orders</div>
          <div className="card-subtitle">Manage customer orders</div>
        </div>
        <div className="table-actions" style={{ display: 'flex', gap: '10px' }}>
          <TextField
            size="small"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button size="small" variant="outlined" color="inherit" onClick={fetchOrders}>
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          {error}
          <Button onClick={fetchOrders} sx={{ ml: 2 }}>Retry</Button>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          No orders found
        </div>
      ) : (
        <div className="table">
          <div className="table-header" style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr' }}>
            <span>Order ID</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Items</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {orders.map((order) => (
            <div
              key={order._id}
              className="table-row"
              style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr', cursor: 'pointer' }}
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <span style={{ fontWeight: 500 }}>{order.orderNumber || order._id}</span>
              <span>{order.contact?.email || order.shippingAddress?.fullName || '-'}</span>
              <span>{formatDate(order.createdAt)}</span>
              <span>{order.items?.length || 0} items</span>
              <span>{formatCurrency(order.totalAmount)}</span>
              <span className={`status ${getStatusClass(order.fulfillmentStatus)}`}>
                {getStatusLabel(order.fulfillmentStatus)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
