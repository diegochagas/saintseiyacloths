import React from 'react'

interface TableProps {
  data: any[]
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <table border={1} cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
      <thead>
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((value: any, i: number) => (
              <td key={i}>{typeof(value) === 'string' ? value : value?.name}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
