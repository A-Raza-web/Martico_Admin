import { useParams, Link } from 'react-router-dom'

const OrderDetails = () => {
    const { id } = useParams()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/orders" className="btn subtle">← Back</Link>
                <h1>Order #{id}</h1>
            </div>

            <div className="grid grid-top">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Order Items</div>
                    </div>
                    <div className="table">
                        <div className="table-row" style={{ gridTemplateColumns: '3fr 1fr 1fr' }}>
                            <span>Product</span>
                            <span>Qty</span>
                            <span>Total</span>
                        </div>
                        <div className="table-row" style={{ gridTemplateColumns: '3fr 1fr 1fr' }}>
                            <span>T-Shirt (XL)</span>
                            <span>2</span>
                            <span>€ 50.00</span>
                        </div>
                        <div className="table-row" style={{ gridTemplateColumns: '3fr 1fr 1fr' }}>
                            <span>Jeans (32)</span>
                            <span>1</span>
                            <span>€ 55.00</span>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <span className="label">Total</span>
                        <span className="value">€ 105.00</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Customer</div>
                    </div>
                    <div className="small-stat" style={{ background: 'transparent', padding: 0 }}>
                        <div className="value" style={{ fontSize: '15px' }}>Theo Lawrence</div>
                        <div className="label">theo@example.com</div>
                        <div className="label">+1 234 567 890</div>
                    </div>
                    <hr style={{ margin: '15px 0', borderTop: '1px solid #e2e8f0' }} />
                    <div className="card-header">
                        <div className="card-title">Shipping Address</div>
                    </div>
                    <div className="label">
                        123 Main St,<br />
                        New York, NY 10001,<br />
                        USA
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails
