import React from 'react';
import { Users, Briefcase, User } from 'lucide-react';
import Card from '../common/Card'; 

/**
 * Stats for "Who's Inside?" view
 */
const PresenceStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card
        title="Total Inside"
        value={stats.total_inside}
        icon={<Users size={24} />}
        bgColor="bg-blue-100"
        textColor="text-blue-600"
      />
      <Card
        title="Staff Inside"
        value={stats.staff_inside}
        icon={<Briefcase size={24} />}
        bgColor="bg-green-100"
        textColor="text-green-600"
      />
      <Card
        title="Students Inside"
        value={stats.students_inside}
        icon={<User size={24} />}
        bgColor="bg-yellow-100"
        textColor="text-yellow-600"
      />
    </div>
  );
};

export default PresenceStats;