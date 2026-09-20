import React from 'react';

const StatCard = ({ icon, color = 'blue', label, value, subtext }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon icon-${color}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="stat-details">
        <h3>{label}</h3>
        <p>{value}</p>
        {subtext && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtext}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
