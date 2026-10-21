import './StatCard.css';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
}

function StatCard({ title, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <div className="statCard">
      <div className="statCardHeader">
        <p>{title}</p>
        {Icon && (
          <div className="statCardIcon">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="statCardValue">
        <h2>{value}</h2>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;
