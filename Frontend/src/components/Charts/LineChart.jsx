import './LineChart.css';

const LineChart = ({ data, title, height = 200 }) => {
  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (((item.value - minValue) / range) * 80 + 10);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="line-chart">
      {title && <div className="chart-title">{title}</div>}
      
      <div className="chart-wrapper" style={{ height: `${height}px` }}>
        <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <g className="grid-lines">
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                className="grid-line"
              />
            ))}
          </g>
          
          {/* Area under the line */}
          <polygon
            points={`0,100 ${points} 100,100`}
            className="chart-area"
          />
          
          {/* Line */}
          <polyline
            points={points}
            className="chart-line"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (((item.value - minValue) / range) * 80 + 10);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                className="chart-point"
              />
            );
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div className="y-axis">
          <span className="y-label">{maxValue}</span>
          <span className="y-label">{Math.round((maxValue + minValue) / 2)}</span>
          <span className="y-label">{minValue}</span>
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="x-axis">
        {data.map((item, index) => {
          // Show only first, middle, and last labels on small datasets
          if (data.length > 6 && index !== 0 && index !== Math.floor(data.length / 2) && index !== data.length - 1) {
            return null;
          }
          return (
            <span key={index} className="x-label">
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default LineChart;
