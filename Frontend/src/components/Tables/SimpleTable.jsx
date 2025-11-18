import './SimpleTable.css';

const SimpleTable = ({ columns, data, onRowClick }) => {
  return (
    <div className="table-container">
      <table className="simple-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="table-header">
                {column.header}
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
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="table-cell">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
