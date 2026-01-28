import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { loaderController } from '../../services/loaderController';

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to the loader controller
    const unsubscribe = loaderController.subscribe((status) => {
      setIsLoading(status);
    });
    return () => unsubscribe();
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
        <Loader2 className="h-10 w-10 text-[#800000] animate-spin mb-3" />
        <p className="text-gray-700 font-medium text-sm">Processing...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;