import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import AddProductCard from '../component/productCard/AddProductCard'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import LoadingBar from 'react-top-loading-bar'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import './ProductList.css'

const ProductForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = Boolean(id)
    const [initialData, setInitialData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    })

    useEffect(() => {
        // Show loading bar on page load
        setProgress(20);
        const timer = setTimeout(() => {
            setProgress(40);
        }, 300);
        
        const timer2 = setTimeout(() => {
            setProgress(70);
        }, 600);
        
        const timer3 = setTimeout(() => {
            setProgress(100);
        }, 900);
        
        // Cleanup timers
        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                setProgress(30);
                setLoading(true)
                try {
                    setProgress(60);
                    const res = await axios.get(`http://localhost:4000/api/products/${id}`)
                    if (res.data.success) {
                        setInitialData(res.data.data)
                    }
                    setProgress(100);
                } catch (error) {
                    console.error('Error fetching product:', error)
                    setProgress(100);
                } finally {
                    setLoading(false)
                }
            }
            fetchProduct()
        }
    }, [id, isEdit])

    const handleCancel = () => {
        navigate('/products/list')
    }

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = async (formData, imageFiles) => {
    setProgress(20);
    setLoading(true)
    try {
        setProgress(40);
        // 1️⃣ Convert images to base64
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => resolve(reader.result)
                reader.onerror = error => reject(error)
            })
        }

        let base64Images = []

        if (imageFiles && imageFiles.length > 0) {
            base64Images = await Promise.all(
                imageFiles.map(file => convertToBase64(file))
            )
        }
        setProgress(60);
        // 2️⃣ Prepare JSON body
        const payload = {
            ...formData,
            images: base64Images
        }

        const url = isEdit
            ? `http://localhost:4000/api/products/${id}`
            : `http://localhost:4000/api/products/create`

        const method = isEdit ? 'put' : 'post'

        const res = await axios[method](url, payload)
        setProgress(90);
        if (res.data.success) {
            const message = isEdit ? 'Product updated successfully!' : 'Product created successfully!';
            navigate(`/products/list?success=${encodeURIComponent(message)}`);
        }
        setProgress(100);
    } catch (error) {
        console.error('Error saving product:', error)
        showSnackbar(error.response?.data?.message || 'Error saving product', 'error');
        setProgress(100);
    } finally {
        setLoading(false)
    }
}


    return (
        <>
        <div className="banners-page">
            <LoadingBar
                color='var(--primary-color)'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                height={4}
            />
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <header className="page-header">
                <div className="header-left">
                    <h2>Product Management</h2>
                </div>
                {!id && (
                    <div className="tabs">
                        <button
                            className="tab active"
                            onClick={() => navigate('/products/new')}
                        >
                            Upload Product
                        </button>
                        <button
                            className="tab"
                            onClick={() => navigate('/products/list')}
                        >
                            Product List
                        </button>
                    </div>
                )}
            </header>

            <div className="page-content">
                <AddProductCard
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    initialData={initialData}
                />
            </div>
        </div>
        
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
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
        </>
    )
}

export default ProductForm
