import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined'
import PaymentIcon from '@mui/icons-material/PaymentOutlined'
import LocalShippingIcon from '@mui/icons-material/LocalShippingOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNoneOutlined'

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    )
}

const Settings = () => {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '0' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'var(--border-color)', px: 3, pt: 2 }}>
                    <div style={{ marginBottom: '16px' }}>
                        <h2 style={{ margin: 0, fontSize: '24px' }}>Settings</h2>
                        <p style={{ margin: '4px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Manage your store's configuration and preferences.
                        </p>
                    </div>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="settings tabs"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '14px',
                                minWidth: 100,
                                color: 'var(--text-secondary)',
                                '&.Mui-selected': {
                                    color: 'var(--primary-color)',
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: 'var(--primary-color)',
                            }
                        }}
                    >
                        <Tab icon={<StorefrontIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="General" />
                        <Tab icon={<PaymentIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Payments" />
                        <Tab icon={<LocalShippingIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Shipping" />
                        <Tab icon={<NotificationsNoneIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Notifications" />
                    </Tabs>
                </Box>

                <div style={{ padding: '0 24px 24px' }}>
                    <TabPanel value={tabValue} index={0}>
                        <div className="form-vertical">
                            <div className="form-row">
                                <div className="form-field">
                                    <TextField label="Store Name" fullWidth size="small" defaultValue="Martico Store" />
                                </div>
                                <div className="form-field">
                                    <TextField label="Store Email" fullWidth size="small" defaultValue="contact@martico.com" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <TextField
                                        select
                                        label="Currency"
                                        fullWidth
                                        size="small"
                                        defaultValue="EUR"
                                    >
                                        <MenuItem value="USD">USD ($)</MenuItem>
                                        <MenuItem value="EUR">EUR (€)</MenuItem>
                                        <MenuItem value="GBP">GBP (£)</MenuItem>
                                    </TextField>
                                </div>
                                <div className="form-field">
                                    <TextField label="Phone Number" fullWidth size="small" defaultValue="+1 234 567 890" />
                                </div>
                            </div>
                            <div className="form-field">
                                <TextField label="Store Address" fullWidth size="small" multiline rows={2} defaultValue="123 Main St, New York, NY 10001" />
                            </div>
                            <div className="form-actions" style={{ marginTop: '16px' }}>
                                <Button variant="contained" color="primary">Save Changes</Button>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="card" style={{ background: 'var(--bg-input)', border: '1px dashed var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src="https://img.icons8.com/color/48/000000/stripe.png" alt="Stripe" style={{ width: 32 }} />
                                        <div>
                                            <div className="card-title">Stripe</div>
                                            <div className="card-subtitle">Accept credit cards and local payments.</div>
                                        </div>
                                    </div>
                                    <Button variant="outlined" size="small">Configure</Button>
                                </div>
                            </div>
                            <div className="card" style={{ background: 'var(--bg-input)', border: '1px dashed var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" style={{ width: 32 }} />
                                        <div>
                                            <div className="card-title">PayPal</div>
                                            <div className="card-subtitle">Allow customers to pay via PayPal.</div>
                                        </div>
                                    </div>
                                    <Button variant="outlined" size="small">Configure</Button>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <div className="form-vertical">
                            <div className="card-title" style={{ marginBottom: '8px' }}>Shipping Zones</div>
                            <div className="table" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                                <div className="table-header" style={{ background: 'var(--bg-input)', padding: '10px 16px', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(0, 1fr) 80px' }}>
                                    <span>Zone Name</span>
                                    <span>Regions</span>
                                    <span>Rates</span>
                                    <span>Status</span>
                                    <span style={{ textAlign: 'right' }}>Actions</span>
                                </div>
                                <div className="table-row" style={{ padding: '10px 16px', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(0, 1fr) 80px' }}>
                                    <span>Domestic</span>
                                    <span>Germany</span>
                                    <span>Free over €50</span>
                                    <span className="status status-success">Active</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button size="small" color="primary" sx={{ minWidth: 'auto', px: 2 }}>Edit</Button>
                                    </div>
                                </div>
                                <div className="table-row" style={{ padding: '10px 16px', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(0, 1fr) 80px' }}>
                                    <span>European Union</span>
                                    <span>EU Member States</span>
                                    <span>Flat rate €15</span>
                                    <span className="status status-success">Active</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button size="small" color="primary" sx={{ minWidth: 'auto', px: 2 }}>Edit</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions" style={{ marginTop: '16px' }}>
                                <Button variant="contained" color="primary">+ Add Shipping Zone</Button>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value={tabValue} index={3}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div className="card-title" style={{ marginBottom: '12px' }}>Notification Channels</div>
                            <div className="preference-row">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 500 }}>Email Notifications</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Receive store activity summaries via email.</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="switch-slider" />
                                </label>
                            </div>
                            <div className="preference-row">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 500 }}>SMS Notifications</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Get urgent order alerts on your phone.</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="switch-slider" />
                                </label>
                            </div>
                            <div className="preference-row">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 500 }}>Push Notifications</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Browser notifications for new orders.</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="switch-slider" />
                                </label>
                            </div>
                        </div>
                    </TabPanel>
                </div>
            </div>
        </div>
    )
}

export default Settings

