import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const [fulfillmentStatus, setFulfillmentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      
      const res = await fetch(`${API_BASE}/orders/admin/orders/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setOrder(json.data);
          setFulfillmentStatus(json.data.fulfillmentStatus || '');
          setTrackingNumber(json.data.trackingNumber || '');
          setAdminNotes(json.data.adminNotes || '');
        }
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      const token = getAdminToken();
      
      const res = await fetch(`${API_BASE}/orders/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          fulfillmentStatus,
          trackingNumber,
          adminNotes,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setOrder(json.data);
        alert('Order updated successfully!');
      } else {
        alert('Failed to update order');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: '20px' }}>
        <Link to="/orders" className="btn subtle">← Back</Link>
        <div style={{ marginTop: '20px', color: 'red' }}>{error || 'Order not found'}</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link to="/orders" className="btn subtle">← Back</Link>
        <h1>Order {order.orderNumber || id}</h1>
      </div>

      <div className="grid grid-top">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Order Items</div>
          </div>
          <div className="table">
            <div className="table-row" style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr' }}>
              <span>Product</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
            </div>
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="table-row" style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr' }}>
                <span>{item.name || 'Product'}</span>
                <span>${(item.price || 0).toFixed(2)}</span>
                <span>{item.quantity || 1}</span>
                <span>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            <div>
              <span className="label">Subtotal: </span>
              <span className="value">{formatCurrency(order.subtotal)}</span>
            </div>
            <div>
              <span className="label">Delivery: </span>
              <span className="value">{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div>
              <span className="label">Total: </span>
              <span className="value">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Customer</div>
          </div>
          <div className="small-stat" style={{ background: 'transparent', padding: 0 }}>
            <div className="value" style={{ fontSize: '15px' }}>{order.shippingAddress?.fullName || '-'}</div>
            <div className="label">{order.contact?.email || '-'}</div>
            <div className="label">{order.contact?.phone || '-'}</div>
          </div>
          <hr style={{ margin: '15px 0', borderTop: '1px solid #e2e8f0' }} />
          
          <div className="card-header">
            <div className="card-title">Shipping Address</div>
          </div>
          <div className="label">
            {order.shippingAddress?.street}<br />
            {order.shippingAddress?.apartment && <>{order.shippingAddress?.apartment}<br /></>}
            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
            {order.shippingAddress?.country}
          </div>

          <hr style={{ margin: '15px 0', borderTop: '1px solid #e2e8f0' }} />
          
          <div className="card-header">
            <div className="card-title">Order Info</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><span className="label">Order Number: </span><span className="value">{order.orderNumber}</span></div>
            <div><span className="label">Date: </span><span className="value">{formatDate(order.createdAt)}</span></div>
            <div><span className="label">Payment Method: </span><span className="value">{order.paymentMethod}</span></div>
            <div><span className="label">Payment Status: </span><span className={`status ${getStatusClass(order.paymentStatus)}`}>{getStatusLabel(order.paymentStatus)}</span></div>
            <div><span className="label">Fulfillment: </span><span className={`status ${getStatusClass(order.fulfillmentStatus)}`}>{getStatusLabel(order.fulfillmentStatus)}</span></div>
            {order.trackingNumber && <div><span className="label">Tracking: </span><span className="value">{order.trackingNumber}</span></div>}
          </div>

          {order.orderNotes && (
            <>
              <hr style={{ margin: '15px 0', borderTop: '1px solid #e2e8f0' }} />
              <div className="card-header">
                <div className="card-title">Customer Notes</div>
              </div>
              <div className="label">{order.orderNotes}</div>
            </>
          )}

          <hr style={{ margin: '15px 0', borderTop: '1px solid #e2e8f0' }} />
          
          <div className="card-header">
            <div className="card-title">Update Order</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Fulfillment Status</InputLabel>
              <Select
                value={fulfillmentStatus}
                label="Fulfillment Status"
                onChange={(e) => setFulfillmentStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              fullWidth
            />
            <TextField
              size="small"
              label="Admin Notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <Button 
              variant="contained" 
              onClick={handleStatusUpdate}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
