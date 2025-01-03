import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
};
