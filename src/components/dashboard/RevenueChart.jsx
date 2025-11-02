import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const RevenueChart = ({ data }) => {
  return (
    <Card title="Revenue vs Expenses" subtitle="Monthly comparison for the current year">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => `LKR ${value.toLocaleString()}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={3}
              name="Revenue"
              dot={{ fill: '#f97316', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#6b7280"
              strokeWidth={3}
              name="Expenses"
              dot={{ fill: '#6b7280', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;