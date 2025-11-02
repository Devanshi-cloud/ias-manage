const StatCard = ({ title, value, icon: Icon, color = "var(--primary)" }) => {
  return (
    <div className="stat-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3>{title}</h3>
          <p>{value}</p>
        </div>
        {Icon && (
          <div
            style={{
              backgroundColor: `${color}20`,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              color: color,
            }}
          >
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
