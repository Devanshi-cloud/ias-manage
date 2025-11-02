interface StatCardProps {
  title: string
  value: number | string
  icon?: string
  color?: string
}

export default function StatCard({ title, value, icon, color = "var(--primary)" }: StatCardProps) {
  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "var(--text-light)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{title}</p>
          <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text)" }}>{value}</h3>
        </div>
        {icon && <span style={{ fontSize: "2rem" }}>{icon}</span>}
      </div>
    </div>
  )
}
