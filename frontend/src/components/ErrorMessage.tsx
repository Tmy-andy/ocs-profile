interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="glass-card p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-neon-blue mb-2">Oops!</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="px-6 py-3 bg-neon-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
