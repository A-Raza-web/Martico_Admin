
const Reports = () => {
    return (
        <div className="grid">
            <div className="grid grid-top">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Sales Overview</div>
                    </div>
                    <div className="chart-placeholder">
                        Chart Placeholder
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Traffic Source</div>
                    </div>
                    <div className="chart-placeholder">
                        Pie Chart Placeholder
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">Best Selling Products</div>
                </div>
                <div className="table">
                    <div className="table-header" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <span>Product</span>
                        <span>Sold</span>
                        <span>Revenue</span>
                    </div>
                    <div className="table-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <span>T-Shirt</span>
                        <span>120</span>
                        <span>€ 3,000.00</span>
                    </div>
                    <div className="table-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <span>Jeans</span>
                        <span>85</span>
                        <span>€ 4,675.00</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reports
