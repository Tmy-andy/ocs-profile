import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-9xl font-bold mb-4"
             style={{
               background: 'linear-gradient(to right, #00d4ff, #3b82f6)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               backgroundClip: 'text'
             }}>
          404
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-3 bg-neon-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
