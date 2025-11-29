import './InfoCard.css';

const InfoCard = ({ 
  title, 
  value, 
  icon, 
  subtitle, 
  trend, 
  trendValue, 
  color = 'primary',
  onClick 
}) => {
  return (
    <div className={`info-card info-card-${color}`} onClick={onClick}>
      <div className="info-card-header">
        <div className="info-card-title">{title}</div>
        {icon && <div className="info-card-icon">{icon}</div>}
      </div>
      
      <div className="info-card-body">
        <div className="info-card-value">{value}</div>
        {subtitle && <div className="info-card-subtitle">{subtitle}</div>}
      </div>
      
      {(trend || trendValue) && (
        <div className="info-card-footer">
          {trend && (
            <span className={`trend trend-${trend}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
          {trendValue && <span className="trend-value">{trendValue}</span>}
        </div>
      )}
    </div>
  );
};

export default InfoCard;
