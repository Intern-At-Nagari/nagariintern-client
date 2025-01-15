import React from 'react';

const LoadingButton = ({ isLoading, children, ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading}
      className={`
        relative w-full bg-blue-500 text-white py-3 px-4 rounded-lg
        font-medium transition-all duration-300 transform
        hover:bg-blue-600 active:scale-95
        disabled:bg-blue-400 disabled:cursor-not-allowed
        flex items-center justify-center
      `}
    >
      {isLoading ? (
        <>
          <span className="opacity-0">{children}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-[bounce_0.9s_infinite]" />
              <div className="w-2 h-2 bg-white rounded-full animate-[bounce_0.9s_0.3s_infinite]" />
              <div className="w-2 h-2 bg-white rounded-full animate-[bounce_0.9s_0.6s_infinite]" />
            </div>
          </div>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;