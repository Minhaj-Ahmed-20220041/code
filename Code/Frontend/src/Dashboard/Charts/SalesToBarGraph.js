import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesToBarGraph = ({ data }) => (
  <ResponsiveContainer width="100%" height={350} style={{padding:"1em"}}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, (dataMax) => (dataMax * 1.25).toFixed(0)]} />
      <Tooltip
        formatter={(value) => [`$${value}`, 'Sales']}
        labelFormatter={(label) => `${label}`}
      />
      <Legend />
      <Bar
        dataKey="value"
        fill="#82ca9d"
        name="Sales"
        label={{ position: 'top', formatter: (value) => `$${value}` }}
      />
    </BarChart>
  </ResponsiveContainer>
);

export default SalesToBarGraph;
