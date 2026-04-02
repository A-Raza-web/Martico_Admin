import { useState } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CampaignIcon from '@mui/icons-material/Campaign'
import AdsClickIcon from '@mui/icons-material/AdsClick'
import GroupsIcon from '@mui/icons-material/Groups'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareIcon from '@mui/icons-material/Share'
import EmailIcon from '@mui/icons-material/Email'
import BarChartIcon from '@mui/icons-material/BarChart'

const MarketingStats = () => {
    return (
        <section className="grid grid-4" style={{ marginBottom: '24px' }}>
            <div className="card small-stat" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="card-header-left">
                    <div className="icon-wrapper primary" style={{ width: '36px', height: '36px' }}>
                        <CampaignIcon sx={{ fontSize: 20 }} />
                    </div>
                </div>
                <div>
                    <div className="label">Active Campaigns</div>
                    <div className="card-balance" style={{ fontSize: '20px', marginTop: '4px' }}>12</div>
                    <div className="trend positive" style={{ fontSize: '11px' }}>+2 this month</div>
                </div>
            </div>
            <div className="card small-stat" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="card-header-left">
                    <div className="icon-wrapper success" style={{ width: '36px', height: '36px' }}>
                        <GroupsIcon sx={{ fontSize: 20 }} />
                    </div>
                </div>
                <div>
                    <div className="label">New Customers</div>
                    <div className="card-balance" style={{ fontSize: '20px', marginTop: '4px' }}>2,845</div>
                    <div className="trend positive" style={{ fontSize: '11px' }}>+15.3%</div>
                </div>
            </div>
            <div className="card small-stat" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="card-header-left">
                    <div className="icon-wrapper secondary" style={{ width: '36px', height: '36px' }}>
                        <AdsClickIcon sx={{ fontSize: 20 }} />
                    </div>
                </div>
                <div>
                    <div className="label">Avg. Click Rate</div>
                    <div className="card-balance" style={{ fontSize: '20px', marginTop: '4px' }}>4.2%</div>
                    <div className="trend positive" style={{ fontSize: '11px' }}>+0.8%</div>
                </div>
            </div>
            <div className="card small-stat" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="card-header-left">
                    <div className="icon-wrapper danger" style={{ width: '36px', height: '36px' }}>
                        <TrendingUpIcon sx={{ fontSize: 20 }} />
                    </div>
                </div>
                <div>
                    <div className="label">Marketing ROI</div>
                    <div className="card-balance" style={{ fontSize: '20px', marginTop: '4px' }}>320%</div>
                    <div className="trend positive" style={{ fontSize: '11px' }}>+12%</div>
                </div>
            </div>
        </section>
    )
}

const MarketingContentList = () => {
    const campaigns = [
        {
            id: 1,
            name: 'Black Friday Super Sale',
            type: 'Email & Social',
            status: 'Active',
            reach: '45,000',
            engagement: '12.5%',
            budget: '€ 2,500',
            icon: <EmailIcon sx={{ fontSize: 18 }} />
        },
        {
            id: 2,
            name: 'Winter Collection Launch',
            type: 'Instagram Ads',
            status: 'Scheduled',
            reach: '120,000',
            engagement: '---',
            budget: '€ 5,000',
            icon: <ShareIcon sx={{ fontSize: 18 }} />
        },
        {
            id: 3,
            name: 'New Year Early Bird',
            type: 'Google Search',
            status: 'Draft',
            reach: '---',
            engagement: '---',
            budget: '€ 1,200',
            icon: <AdsClickIcon sx={{ fontSize: 18 }} />
        },
        {
            id: 4,
            name: 'Customer Appreciation Day',
            type: 'Multi-channel',
            status: 'Ended',
            reach: '28,400',
            engagement: '8.2%',
            budget: '€ 800',
            icon: <CampaignIcon sx={{ fontSize: 18 }} />
        }
    ]

    return (
        <div className="card table-card">
            <div className="card-header">
                <div>
                    <div className="card-title">Marketing Campaigns</div>
                    <div className="card-subtitle">Overview of your marketing activities and performance</div>
                </div>
                <div className="table-actions">
                    <Button variant="contained" size="small" startIcon={<CampaignIcon />}>New Campaign</Button>
                </div>
            </div>
            <div className="table">
                <div className="table-header" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 0.5fr' }}>
                    <span>Campaign Name</span>
                    <span>Platform</span>
                    <span>Status</span>
                    <span>Reach</span>
                    <span>Budget</span>
                    <span></span>
                </div>
                {campaigns.map((camp) => (
                    <div key={camp.id} className="table-row" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 0.5fr', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="icon-wrapper subtle" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-input)' }}>
                                {camp.icon}
                            </div>
                            <span style={{ fontWeight: 600 }}>{camp.name}</span>
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{camp.type}</span>
                        <span>
                            <span className={`status ${camp.status === 'Active' ? 'status-success' :
                                camp.status === 'Scheduled' ? 'status-pending' :
                                    camp.status === 'Ended' ? 'status-failed' : 'status-subtle'
                                }`} style={{ fontSize: '10px' }}>
                                {camp.status}
                            </span>
                        </span>
                        <span>{camp.reach}</span>
                        <span style={{ fontWeight: 600 }}>{camp.budget}</span>
                        <div style={{ textAlign: 'right' }}>
                            <IconButton size="small">
                                <MoreVertIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const Marketing = () => {
    return (
        <div className="marketing-page">
            <MarketingStats />
            <MarketingContentList />

            <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', marginTop: '24px' }}>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Engagement Over Time</div>
                    </div>
                    <div className="chart-placeholder" style={{ height: '240px', background: 'var(--bg-input)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BarChartIcon sx={{ fontSize: 48, color: 'var(--text-muted)', opacity: 0.5 }} />
                        <span style={{ marginLeft: '12px', color: 'var(--text-muted)' }}>Conversion Data Visualization Coming Soon</span>
                    </div>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', color: '#fff' }}>
                    <div className="card-title" style={{ color: '#fff' }}>Pro Marketing Tip</div>
                    <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '12px', lineHeight: 1.6 }}>
                        Personalized email campaigns see a 26% higher open rate than generic ones.
                        Try segmenting your audience by purchase history for your next launch!
                    </p>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            mt: 2,
                            color: '#fff',
                            borderColor: 'rgba(255,255,255,0.5)',
                            '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        Learn More
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Marketing
