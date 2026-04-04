import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import logo from '../assets/logo.png';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://martico-server.vercel.app/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data._id) {
                // Store token and user info
                const userData = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone
                }
                console.log('Signup: Storing user data:', userData)
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                // Redirect to dashboard
                navigate('/');
            } else {
                setError(data.message || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            const token = await firebaseUser.getIdToken();

            const userData = {
                _id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Google User',
                email: firebaseUser.email || '',
                phone: firebaseUser.phoneNumber || '',
                profileImage: firebaseUser.photoURL || '',
                authProvider: 'firebase',
                uid: firebaseUser.uid
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/');
        } catch (err) {
            const message = err?.code === 'auth/popup-closed-by-user'
                ? 'Sign-in canceled.'
                : err?.message || 'Google sign-in failed';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <img src={logo} alt="Martico Logo" className="auth-logo" />
                        <h1 className="auth-title">Create an account</h1>
                        <p className="auth-subtitle">Join Martico Admin Panel today</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" style={{ 
                            padding: '10px', 
                            marginBottom: '15px', 
                            borderRadius: '8px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <TextField
                            label="Full Name"
                            name="name"
                            type="text"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Email Address"
                            name="email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            type="submit"
                            disabled={loading}
                            sx={{ borderRadius: '12px', py: 1.5, mt: 1 }}
                        >
                            {loading ? 'Creating Account...' : 'Sign up'}
                        </Button>

                        <div className="auth-divider">or</div>

                        <Button
                            variant="outlined"
                            fullWidth
                            className="google-btn"
                            disabled={loading}
                            onClick={handleGoogleSignIn}
                            startIcon={
                                <svg className="google-icon" viewBox="0 0 24 24">
                                    <path
                                        fill="#EA4335"
                                        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.727 1.245 6.709l4.021 3.056z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M1.245 6.709A6.99 6.99 0 0 0 1 12c0 1.927.455 3.736 1.245 5.291l4.021-3.055A7.025 7.025 0 0 1 5.266 9.765L1.245 6.709z"
                                    />
                                    <path
                                        fill="#4285F4"
                                        d="M12 24c3.155 0 5.8-1.045 7.727-2.836l-3.773-2.927c-1.082.727-2.436 1.155-3.954 1.155-3.045 0-5.627-2.055-6.545-4.818l-4.021 3.055C3.191 21.273 7.273 24 12 24z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M24 12c0-.864-.064-1.745-.191-2.582H12v4.891h6.755c-.291 1.555-1.136 2.845-2.455 3.727l3.773 2.927C22.318 18.827 24 15.7 24 12z"
                                    />
                                </svg>
                            }
                        >
                            Continue with Google
                        </Button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
