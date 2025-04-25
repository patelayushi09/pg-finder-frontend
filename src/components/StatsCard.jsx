import React from 'react';
import { TrendingUp } from 'lucide-react';

export function StatsCard({ title, value, trend, Icon }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-[#103538] mt-1">{value}</h3>
        </div>
        <div className="bg-[#DCD29F] bg-opacity-20 p-3 rounded-full">
          <Icon className="w-6 h-6 text-[#D8B258]" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        <span className="text-sm text-green-500">{trend} this month</span>
      </div>
    </div>
  );
}

export default StatsCard;
