import './SimpleTable.css';

const SimpleTable = ({ columns, data, onRowClick }) => {
  return (
    <div className="table-container">
      <table className="simple-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="table-header">
                {column.header || column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="table-row"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => {
                  const accessor = column.accessor || column.key;
                  const value = row[accessor];
                  return (
                    <td key={colIndex} className="table-cell">
                      {column.render ? column.render(value, row) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
