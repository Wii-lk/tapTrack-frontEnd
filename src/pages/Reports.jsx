import React from 'react';
import Card from '../components/common/Card';

const Reports = () => {
  return (
    <div>
      <Card title="Reports" subtitle="Generate and view various reports">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Reports Module</p>
          <p className="text-sm text-gray-500">This page will contain report generation functionality</p>
        </div>
      </Card>
    </div>
  );
};

export default Reports;