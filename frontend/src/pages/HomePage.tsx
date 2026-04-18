import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const HomePage = () => {
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed) {
      setError('Vui lòng nhập slug chủ sở hữu');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(trimmed)) {
      setError('Slug chỉ chứa chữ thường, số, dấu gạch ngang');
      return;
    }
    navigate(`/${trimmed}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{
              background: 'linear-gradient(to right, #00d4ff, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            OC Profile Gallery
          </h1>
          <p className="text-gray-400 text-lg">
            Nhập slug chủ sở hữu để xem bộ sưu tập character của họ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setError(null);
              }}
              placeholder="Nhập slug chủ sở hữu (vd: andy)"
              autoFocus
              className="w-full px-6 py-4 rounded-xl bg-dark-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all duration-300"
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-neon-blue hover:bg-neon-blue/80 text-dark-900 font-bold rounded-xl transition-all duration-300"
          >
            Xem bộ sưu tập
          </button>
        </form>

        {authService.isAuthenticated() && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 hover:border-neon-blue text-neon-blue rounded-lg transition-all duration-300 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Quản lý Dashboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
