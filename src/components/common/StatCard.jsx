import React from "react";

const StatCard = ({title, value, icon}) => {
    return(
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                {icon}
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
}