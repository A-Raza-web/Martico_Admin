import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import SecurityIcon from '@mui/icons-material/Security'
import PersonIcon from '@mui/icons-material/Person'

const Profile = () => {
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    // Get user data from localStorage on component mount
    const [storedUser, setStoredUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        console.log('Profile: Loading user data from localStorage:', userData)
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData)
                console.log('Profile: Parsed user:', parsedUser)
                setStoredUser(parsedUser)
                setFormData({
                    fullName: parsedUser.name || '',
                    email: parsedUser.email || '',
                    phone: parsedUser.phone || '',
                    role: parsedUser.role || 'Admin',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            } catch (e) {
                console.error('Error parsing user data:', e)
            }
        } else {
            console.log('Profile: No user data found in localStorage')
        }
    }, [])

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'Admin',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfileImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        console.log('Saving profile:', formData)
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        
        if (!token) {
            alert('Please log in first')
            return
        }

        try {
            const response = await fetch('http://localhost:4000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.fullName,
                    phone: formData.phone,
                    role: formData.role
                })
            })

            const data = await response.json()

            if (data._id) {
                // Update localStorage with new user data
                if (storedUser) {
                    const updatedUser = {
                        ...storedUser,
                        name: formData.fullName,
                        phone: formData.phone,
                        role: formData.role
                    }
                    localStorage.setItem('user', JSON.stringify(updatedUser))
                }
                alert('Profile updated successfully!')
            } else {
                alert(data.message || 'Failed to update profile')
            }
        } catch (err) {
            console.error('Error updating profile:', err)
            alert('Error updating profile. Please try again.')
        }
    }

    const handleUpdatePassword = (e) => {
        e.preventDefault()
        console.log('Updating password:', formData)
        // Implement API call here
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Profile Summary Header */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '32px' }}>
                <div style={{ position: 'relative' }}>
                    <Avatar
                        src={imagePreview}
                        sx={{ width: 100, height: 100, fontSize: '32px', bgcolor: 'var(--primary-color)' }}
                    >
                        {formData.fullName.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="icon-button-file"
                        type="file"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="icon-button-file">
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                bgcolor: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                        >
                            <PhotoCamera sx={{ fontSize: 20 }} />
                        </IconButton>
                    </label>
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px' }}>{formData.fullName}</h2>
                    <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>{formData.role}</p>
                    <span className="pill success" style={{ marginTop: '8px' }}>Active Account</span>
                </div>
            </div>

            <div className="grid grid-main">
                {/* Personal Details Form */}
                <div className="card">
                    <div className="card-header" style={{ marginBottom: '24px' }}>
                        <div className="card-header-left">
                            <div className="icon-wrapper primary">
                                <PersonIcon sx={{ fontSize: 20 }} />
                            </div>
                            <div>
                                <div className="card-title">Personal Details</div>
                                <div className="card-subtitle">Update your personal information</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSaveProfile} className="form-vertical">
                        <div className="form-row">
                            <div className="form-field">
                                <TextField
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                />
                            </div>
                            <div className="form-field">
                                <TextField
                                    label="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                />
                            </div>
                            <div className="form-field">
                                <TextField
                                    select
                                    label="Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value="Store Manager">Store Manager</MenuItem>
                                    <MenuItem value="Admin">Admin</MenuItem>
                                    <MenuItem value="Editor">Editor</MenuItem>
                                </TextField>
                            </div>
                        </div>

                        <div className="form-actions" style={{ marginTop: '12px' }}>
                            <Button variant="contained" color="primary" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Security Section */}
                <div className="card">
                    <div className="card-header" style={{ marginBottom: '24px' }}>
                        <div className="card-header-left">
                            <div className="icon-wrapper danger">
                                <SecurityIcon sx={{ fontSize: 20 }} />
                            </div>
                            <div>
                                <div className="card-title">Security</div>
                                <div className="card-subtitle">Change your password</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="form-vertical">
                        <TextField
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        />
                        <div className="form-actions" style={{ marginTop: '12px' }}>
                            <Button variant="contained" color="primary" type="submit">
                                Update Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile
