import React from 'react';
import Card from '../components/common/Card';

const PaymentsManagement = () => {
  return (
    <div>
      <Card title="Payments Management" subtitle="Manage teacher salaries and payments">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Payments Management Module</p>
          <p className="text-sm text-gray-500">This page will contain salary and payment processing functionality</p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentsManagement;