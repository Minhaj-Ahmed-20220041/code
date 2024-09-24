import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28'];

const SalesToPieChart = ({ data }) => {
  const numericData = data.map(item => ({
    ...item,
    value: parseFloat(item.value),
  }));

  return (
    <ResponsiveContainer width="100%" height={350} style={{padding:"1em"}}>
      <PieChart>
        <Pie
          data={numericData}
          dataKey="value"
          nameKey="name"
          cx="50%" cy="50%"
          outerRadius={100}
          fill="#8884d8"
          labelLine={false}
          label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
        >
          {numericData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${parseFloat(value).toFixed(2)}`} />
        {/* <Legend /> */}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SalesToPieChart;
