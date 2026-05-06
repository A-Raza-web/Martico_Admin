import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import axios from 'axios';

function ProductDeleteDialog({ open, onClose, onConfirm, productName, productId }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

            const response = await axios.delete(
                `https://martico-server.vercel.app/api/products/${productId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                }
            );
            
            if (response.data.success) {
                if (onConfirm) {
                    onConfirm();
                }
                onClose(); 
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            if (error.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
            } else {
                setError(error.response?.data?.message || 'Failed to delete product.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Delete Product?"}
            </DialogTitle>
            <DialogContent>
                {error && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        color: '#dc2626',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}
                <div id="alert-dialog-description">
                    Are you sure you want to delete the product <strong>{productName}</strong>? This action cannot be undone.
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleDelete} 
                    color="error" 
                    autoFocus 
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductDeleteDialog;
