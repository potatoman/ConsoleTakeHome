import './tables.css'

const Table = ({ title, data }: { title: string; data: Record<string, any>[] }) => (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {Object.keys(data[0] || {})
              .filter(key => !['collectionId', 'collectionName', 'updated', 'created', 'updatedAt'].includes(key))
              .map((key) => (
                <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.entries(row)
                .filter(([key]) => !['collectionId', 'collectionName', 'updated', 'created', 'updatedAt'].includes(key))
                .map(([key, value], i) => (
                  <td key={i} style={{ maxWidth: key === "logo" ? "60px" : "150px" }}>
                    {key === "logo" && typeof value === "string" && value.startsWith("http") ? (
                      <img src={value} alt="logo" style={{ width: "40px", height: "40px" }} />
                    ) : (
                      value
                    )}
                  </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  
  export default Table;
  