import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import logo from '../assets/logo.png';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

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
        if (!formData.email || !formData.password) {
            setError('Please enter email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/auth/signin', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
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
                console.log('Login: Storing user data:', userData)
                
                if (rememberMe) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('user', JSON.stringify(userData));
                }
                // Redirect to dashboard
                navigate('/');
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Login error:', err);
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

            if (rememberMe) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('user', JSON.stringify(userData));
            }

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
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Please enter your details to sign in</p>
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

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        size="small" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                }
                                label={<Typography variant="body2">Remember me</Typography>}
                            />
                            <Link to="#" className="auth-link" style={{ fontSize: '13px' }}>
                                Forgot password?
                            </Link>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            type="submit"
                            disabled={loading}
                            sx={{ borderRadius: '12px', py: 1.5 }}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
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
                        Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
