import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

const Alert = ({type = 'error', message, onClose}) => {
    const styles = {
        error: 'bg-red-50 border-red-200 text-red-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const icons = {
        error: AlertCircle,
        success: CheckCircle,
        info: AlertCircle
    };

    const Icon = icons[type];

    return(
        <div className={`py-4 mb-4 rounded-lg border ${styles[type]} flex items-start`}>
            <Icon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"/>
            <div className="flex-1">
                <p className="text-sm">{message}</p>
            </div>
            {onClose && (
                <button
                onClick={onClose}
                className="ml-2 text-gray-500 hover:text-gray-700 ext-xl loading-none"
                >
                    ×
                </button>
            )}
        </div>
    );
};


export default Alert;