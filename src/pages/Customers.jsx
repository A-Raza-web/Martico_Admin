import Button from '@mui/material/Button'

const Customers = () => {
    const customers = [
        { id: 1, name: 'Theo Lawrence', email: 'theo@example.com', orders: 12, spent: '€ 1,250.00', lastOrder: 'Nov 18, 2024' },
        { id: 2, name: 'Amy Merch', email: 'amy@example.com', orders: 5, spent: '€ 450.00', lastOrder: 'Nov 17, 2024' },
        { id: 3, name: 'John Doe', email: 'john@example.com', orders: 2, spent: '€ 120.00', lastOrder: 'Nov 15, 2024' },
        { id: 4, name: 'Alice Smith', email: 'alice@example.com', orders: 8, spent: '€ 890.00', lastOrder: 'Nov 12, 2024' },
    ]

    return (
        <div className="card table-card">
            <div className="card-header">
                <div>
                    <div className="card-title">Customers</div>
                    <div className="card-subtitle">Manage your customer base</div>
                </div>
                <div className="table-actions">
                    <Button variant="outlined" color="inherit">Export</Button>
                </div>
            </div>
            <div className="table">
                <div className="table-header" style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr' }}>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Orders</span>
                    <span>Spent</span>
                    <span>Last Order</span>
                </div>
                {customers.map((customer) => (
                    <div key={customer.id} className="table-row" style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr' }}>
                        <span style={{ fontWeight: 500 }}>{customer.name}</span>
                        <span>{customer.email}</span>
                        <span>{customer.orders}</span>
                        <span>{customer.spent}</span>
                        <span>{customer.lastOrder}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Customers
