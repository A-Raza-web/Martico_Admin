import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LanguageIcon from '@mui/icons-material/LanguageOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettingsOutlined'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActiveOutlined'

const UserSettings = () => {
    const [settings, setSettings] = useState({
        language: 'English',
        timezone: '(GMT-05:00) Eastern Time',
        compactMode: false,
        stickyHeader: true,
        emailDigest: 'Daily',
        marketingEmails: false
    })

    const handleChange = (name, value) => {
        setSettings(prev => ({ ...prev, [name]: value }))
    }

    const handleToggle = (name) => {
        setSettings(prev => ({ ...prev, [name]: !prev[name] }))
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
                <div className="card-header" style={{ marginBottom: '24px' }}>
                    <div className="card-header-left">
                        <div className="icon-wrapper primary">
                            <LanguageIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <div className="card-title">Account Preferences</div>
                            <div className="card-subtitle">Localize your dashboard experience</div>
                        </div>
                    </div>
                </div>

                <div className="form-vertical">
                    <div className="form-row">
                        <div className="form-field">
                            <TextField
                                select
                                label="Language"
                                value={settings.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                                fullWidth
                                size="small"
                            >
                                <MenuItem value="English">English (US)</MenuItem>
                                <MenuItem value="Spanish">Spanish</MenuItem>
                                <MenuItem value="French">French</MenuItem>
                                <MenuItem value="German">German</MenuItem>
                            </TextField>
                        </div>
                        <div className="form-field">
                            <TextField
                                select
                                label="Timezone"
                                value={settings.timezone}
                                onChange={(e) => handleChange('timezone', e.target.value)}
                                fullWidth
                                size="small"
                            >
                                <MenuItem value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</MenuItem>
                                <MenuItem value="(GMT+00:00) London">(GMT+00:00) London</MenuItem>
                                <MenuItem value="(GMT+01:00) Berlin">(GMT+01:00) Berlin</MenuItem>
                                <MenuItem value="(GMT+05:30) Mumbai">(GMT+05:30) Mumbai</MenuItem>
                            </TextField>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header" style={{ marginBottom: '24px' }}>
                    <div className="card-header-left">
                        <div className="icon-wrapper secondary">
                            <DisplaySettingsIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <div className="card-title">Interface Settings</div>
                            <div className="card-subtitle">Customize how Martico looks for you</div>
                        </div>
                    </div>
                </div>

                <Stack spacing={2}>
                    <div className="preference-row">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500 }}>Compact Mode</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Reduce spacing to see more content at once.</span>
                        </div>
                        <Switch
                            checked={settings.compactMode}
                            onChange={() => handleToggle('compactMode')}
                            color="primary"
                        />
                    </div>
                    <div className="preference-row">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500 }}>Sticky Data Tables</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Keep table headers visible while scrolling.</span>
                        </div>
                        <Switch
                            checked={settings.stickyHeader}
                            onChange={() => handleToggle('stickyHeader')}
                            color="primary"
                        />
                    </div>
                </Stack>
            </div>

            <div className="card">
                <div className="card-header" style={{ marginBottom: '24px' }}>
                    <div className="card-header-left">
                        <div className="icon-wrapper primary">
                            <NotificationsActiveIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <div className="card-title">Personal Notifications</div>
                            <div className="card-subtitle">Manage alerts for your account activity</div>
                        </div>
                    </div>
                </div>

                <div className="form-vertical">
                    <div className="form-field">
                        <TextField
                            select
                            label="Email Digest Frequency"
                            value={settings.emailDigest}
                            onChange={(e) => handleChange('emailDigest', e.target.value)}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="None">None</MenuItem>
                            <MenuItem value="Daily">Daily</MenuItem>
                            <MenuItem value="Weekly">Weekly</MenuItem>
                        </TextField>
                    </div>

                    <div className="preference-row" style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500 }}>Marketing Updates</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Receive news about Martico features and updates.</span>
                        </div>
                        <Switch
                            checked={settings.marketingEmails}
                            onChange={() => handleToggle('marketingEmails')}
                            color="primary"
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '40px' }}>
                <Button variant="outlined" color="inherit">Discard</Button>
                <Button variant="contained" color="primary">Save Preferences</Button>
            </div>
        </div>
    )
}

export default UserSettings
