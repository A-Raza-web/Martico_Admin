
import { useState } from 'react'
import Button from '@mui/material/Button'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined'
import PeopleAltIcon from '@mui/icons-material/PeopleAltOutlined'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

function TotalRevenueCard() {
    return (
        <div className="card total-balance-card">
            <div className="card-header">
                <div className="card-header-left">
                    <div className="icon-wrapper primary">
                        <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <div className="card-title">Total Revenue</div>
                        <div className="card-balance">€ 320,845.20</div>
                    </div>
                </div>
                <div className="card-header-right">
                    <span className="pill success">+5.8%</span>
                    <Button size="small" variant="text" color="inherit">Manage</Button>
                </div>
            </div>
            <div className="card-footer">
                <div className="card-footer-item">
                    <span className="label">Online Store</span>
                    <span className="value">€ 214,520.20</span>
                </div>
                <div className="card-footer-item">
                    <span className="label">Marketplace</span>
                    <span className="value">€ 74,320.00</span>
                </div>
                <div className="card-footer-item">
                    <span className="label">POS</span>
                    <span className="value">€ 32,005.00</span>
                </div>
            </div>
        </div>
    )
}

function SmallStatsCard() {
    return (
        <div className="card small-stats-card">
            <div className="small-stat">
                <div className="small-stat-header">
                    <div className="icon-wrapper secondary">
                        <ShoppingBagIcon sx={{ fontSize: 18 }} />
                    </div>
                    <div className="trend positive">+10.9%</div>
                </div>
                <div className="small-stat-footer">
                    <div className="label">Orders</div>
                    <div className="value">8,672</div>
                </div>
            </div>
            <div className="small-stat">
                <div className="small-stat-header">
                    <div className="icon-wrapper success">
                        <PeopleAltIcon sx={{ fontSize: 18 }} />
                    </div>
                    <div className="trend neutral">2.8%</div>
                </div>
                <div className="small-stat-footer">
                    <div className="label">Customers</div>
                    <div className="value">3,765</div>
                </div>
            </div>
            <div className="small-stat">
                <div className="small-stat-header">
                    <div className="icon-wrapper danger">
                        <TrendingDownIcon sx={{ fontSize: 18 }} />
                    </div>
                    <div className="trend negative">+1.5%</div>
                </div>
                <div className="small-stat-footer">
                    <div className="label">Refunds</div>
                    <div className="value">214</div>
                </div>
            </div>
        </div>
    )
}

function CashFlowCard() {
    const [timeframe, setTimeframe] = useState('weekly')

    const data = {
        weekly: [-20, 12, 18, -8, 30, -15, 10, 22, -5, 16, -12, 24],
        daily: [15, 25, -10, 20, 35, 40, -5, 10, 30, 25, 45, 50, 20, -15, 10, 18, 22, 30, 40, -5, 12, 28, 35, 45, 55, 60, -10, 20, 30, 40]
    }

    const values = data[timeframe]

    return (
        <div className="card cashflow-card">
            <div className="card-header">
                <div>
                    <div className="card-title">Cash Flow</div>
                    <div className="card-subtitle">Last 30 days</div>
                </div>
                <div className="pill-group">
                    <Button
                        size="small"
                        variant={timeframe === 'weekly' ? 'contained' : 'text'}
                        color={timeframe === 'weekly' ? 'primary' : 'inherit'}
                        sx={{ borderRadius: '20px' }}
                        onClick={() => setTimeframe('weekly')}
                    >
                        Weekly
                    </Button>
                    <Button
                        size="small"
                        variant={timeframe === 'daily' ? 'contained' : 'text'}
                        color={timeframe === 'daily' ? 'primary' : 'inherit'}
                        sx={{ borderRadius: '20px' }}
                        onClick={() => setTimeframe('daily')}
                    >
                        Daily
                    </Button>
                </div>
            </div>
            <div className="chart">
                {values.map((value, index) => (
                    <div key={index} className="chart-column">
                        <div
                            className={value >= 0 ? 'bar bar-positive' : 'bar bar-negative'}
                            style={{
                                height: `${Math.abs(value) * (timeframe === 'weekly' ? 2.5 : 1.5)}px`,
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="chart-legend">
                <div className="legend-item">
                    <span className="legend-dot positive" />
                    <span>Income</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot negative" />
                    <span>Expense</span>
                </div>
            </div>
        </div>
    )
}

function SideStatsCard() {
    return (
        <div className="card side-stats-card">
            <div className="side-stat">
                <div className="label">Income</div>
                <div className="value">€ 12,378.20</div>
                <div className="trend positive">+6.5%</div>
            </div>
            <div className="side-stat">
                <div className="label">Expense</div>
                <div className="value">€ 5,788.21</div>
                <div className="trend negative">-2.1%</div>
            </div>
            <hr />
            <div className="side-stat">
                <div className="label">Tax Reserve</div>
                <div className="value">€ 14,376.16</div>
                <div className="trend neutral">+3.2%</div>
            </div>
            <div className="side-stat">
                <div className="label">Average Order Value</div>
                <div className="value">€ 54.80</div>
                <div className="trend positive">+1.2%</div>
            </div>
        </div>
    )
}

function RecentOrdersTable() {
    return (
        <div className="card table-card">
            <div className="card-header">
                <div>
                    <div className="card-title">Recent Orders</div>
                    <div className="card-subtitle">Latest orders across channels</div>
                </div>
                <div className="table-actions">
                    <Button size="small" variant="outlined" color="inherit">Filter</Button>
                    <Button size="small" variant="outlined" color="inherit">Sort</Button>
                </div>
            </div>
            <div className="table">
                <div className="table-header">
                    <span>Customer</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span>Channel</span>
                </div>
                <div className="table-row">
                    <span>Theo Lawrence</span>
                    <span>Nov 18, 2024</span>
                    <span>€ 650.00</span>
                    <span className="status status-success">Paid</span>
                    <span>Online Store</span>
                </div>
                <div className="table-row">
                    <span>Amy Merch</span>
                    <span>Nov 17, 2024</span>
                    <span>€ 250.00</span>
                    <span className="status status-pending">Pending</span>
                    <span>Marketplace</span>
                </div>
                <div className="table-row">
                    <span>Bank Transfer</span>
                    <span>Nov 16, 2024</span>
                    <span>€ 1,200.00</span>
                    <span className="status status-failed">Failed</span>
                    <span>B2B</span>
                </div>
            </div>
        </div>
    )
}

function PayoutCard() {
    return (
        <div className="card cards-card">
            <div className="card-header">
                <div className="card-title">Payout Account</div>
                <Button size="small" variant="text" color="inherit">See all</Button>
            </div>
            <div className="payment-card">
                <div className="payment-card-chip" />
                <div className="payment-card-number">**** **** **** 2104</div>
                <div className="payment-card-footer">
                    <div>
                        <div className="label">Balance</div>
                        <div className="value">€ 4,540.20</div>
                    </div>
                    <div>
                        <div className="label">Card Holder</div>
                        <div className="value">Martico Store</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Dashboard = () => {
    return (
        <>
            <section className="grid grid-top">
                <TotalRevenueCard />
                <SmallStatsCard />
            </section>
            <section className="grid grid-main">
                <CashFlowCard />
                <SideStatsCard />
            </section>
            <section className="grid grid-bottom">
                <RecentOrdersTable />
                <PayoutCard />
            </section>
        </>
    )
}

export default Dashboard
