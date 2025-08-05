import React from 'react';
import { Package, PackageX, Warehouse } from 'lucide-react';

interface StatsProps {
  stats: {
    totalShelves: number;
    availableShelves: number;
    occupiedShelves: number;
  };
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  const occupancyRate = stats.totalShelves > 0 
    ? ((stats.occupiedShelves / stats.totalShelves) * 100).toFixed(1)
    : '0';

  return (
    <div className="stats">
      <div className="stat-card">
        <Warehouse size={32} color="#667eea" />
        <div className="stat-number">{stats.totalShelves}</div>
        <div className="stat-label">Total de Prateleiras</div>
      </div>
      
      <div className="stat-card">
        <PackageX size={32} color="#ff6b6b" />
        <div className="stat-number">{stats.availableShelves}</div>
        <div className="stat-label">Prateleiras Disponíveis</div>
      </div>
      
      <div className="stat-card">
        <Package size={32} color="#2ed573" />
        <div className="stat-number">{stats.occupiedShelves}</div>
        <div className="stat-label">Prateleiras Ocupadas</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{occupancyRate}%</div>
        <div className="stat-label">Taxa de Ocupação</div>
      </div>
    </div>
  );
};

export default Stats; 