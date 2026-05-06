import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

const API_BASE = import.meta.env.VITE_API_URL || 'https://martico-server.vercel.app/api';

const getAdminToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('token') ||
           sessionStorage.getItem('adminToken') || sessionStorage.getItem('token');
};

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const token = getAdminToken();
            
            const res = await fetch(`${API_BASE}/users/admin/customers?q=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const json = await res.json();
            if (res.ok && json.success) {
                setCustomers(json.data);
            } else {
                setError(json.message || 'Failed to fetch customers');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(fetchCustomers, 500);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    return (
        <div className="card table-card">
            <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        <div className="card-title">Customers</div>
                        <div className="card-subtitle">Manage your customer base</div>
                    </div>
                    <Button variant="outlined" color="inherit">Export</Button>
                </div>
                
                <TextField 
                    size="small" 
                    placeholder="Search by name or email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: '100%', maxWidth: '400px' }}
                />
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <CircularProgress size={30} />
                </div>
            ) : error ? (
                <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>
            ) : (
                <div className="table">
                    <div className="table-header" style={{ gridTemplateColumns: '2fr 2fr 1.5fr' }}>
                        <span>Name</span>
                        <span>Email</span>
                        <span>Joined Date</span>
                    </div>
                    {customers.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>No customers found.</div>
                    ) : (
                        customers.map((customer) => (
                            <div key={customer._id} className="table-row" style={{ gridTemplateColumns: '2fr 2fr 1.5fr' }}>
                                <span style={{ fontWeight: 500 }}>{customer.name}</span>
                                <span>{customer.email}</span>
                                <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Customers;
