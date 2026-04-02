import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'

const Orders = () => {
    const orders = [
        { id: '#1001', customer: 'Theo Lawrence', date: 'Nov 18, 2024', amount: '€ 650.00', status: 'Paid', items: 3 },
        { id: '#1002', customer: 'Amy Merch', date: 'Nov 17, 2024', amount: '€ 250.00', status: 'Pending', items: 1 },
        { id: '#1003', customer: 'Bank Transfer', date: 'Nov 16, 2024', amount: '€ 1,200.00', status: 'Failed', items: 5 },
        { id: '#1004', customer: 'John Doe', date: 'Nov 15, 2024', amount: '€ 120.00', status: 'Paid', items: 2 },
    ]

    return (
        <div className="card table-card">
            <div className="card-header">
                <div>
                    <div className="card-title">Orders</div>
                    <div className="card-subtitle">Manage customer orders</div>
                </div>
                <div className="table-actions">
                    <Button size="small" variant="outlined" color="inherit">Filter</Button>
                    <Button size="small" variant="outlined" color="inherit">Sort</Button>
                </div>
            </div>
            <div className="table">
                <div className="table-header" style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr' }}>
                    <span>Order ID</span>
                    <span>Customer</span>
                    <span>Date</span>
                    <span>Items</span>
                    <span>Amount</span>
                    <span>Status</span>
                </div>
                {orders.map((order) => (
                    <div key={order.id} className="table-row" style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                        <Link to={`/orders/${order.id.replace('#', '')}`} style={{ display: 'contents', color: 'inherit', textDecoration: 'none' }}>
                            <span style={{ fontWeight: 500 }}>{order.id}</span>
                            <span>{order.customer}</span>
                            <span>{order.date}</span>
                            <span>{order.items} items</span>
                            <span>{order.amount}</span>
                            <span className={`status ${order.status === 'Paid' ? 'status-success' :
                                order.status === 'Pending' ? 'status-pending' : 'status-failed'
                                }`}>
                                {order.status}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders
