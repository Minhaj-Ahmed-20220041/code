import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesToLineChart = ({data}) => (
  <ResponsiveContainer width="100%" height={350} style={{padding:"1em"}}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip
        formatter={(value) => [`$${value}`, 'Sales']}
      />
      {/* <Legend /> */}
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

export default SalesToLineChart;
