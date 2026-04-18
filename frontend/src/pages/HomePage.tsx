import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Character } from '../types';
import characterService from '../services/characterService';
import authService from '../services/authService';
import Card from '../components/Card';
import Tag from '../components/Tag';
import ErrorMessage from '../components/ErrorMessage';

const HomePage = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await characterService.getAll({
        page,
        limit: 12,
        search: search || undefined,
      });
      setCharacters(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [page, search]);

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4"
              style={{
                background: 'linear-gradient(to right, #00d4ff, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            OC Profile Gallery
          </h1>
          <p className="text-gray-400 text-lg">
            Discover amazing original characters
          </p>

          {/* Admin Dashboard Button */}
          {authService.isAuthenticated() && (
            <div className="mt-6">
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 hover:border-neon-blue text-neon-blue rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg shadow-neon-blue/20"
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

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search characters..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-6 py-4 rounded-xl bg-dark-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:shadow-glow-blue transition-all duration-300"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(0, 212, 255, 0.7)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {error && (
          <ErrorMessage message={error} onRetry={fetchCharacters} />
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-xl">No characters found</p>
          </div>
        ) : (
          <>
            {/* Character Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {characters.map((character) => (
                <Card
                  key={character._id}
                  hover
                  className="cursor-pointer p-0 overflow-hidden group"
                  onClick={() => navigate(`/character/${character.slug || character._id}`)}
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={character.avatarImage}
                      alt={character.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />

                    {/* Character info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                        {character.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {character.about}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {character.tags.slice(0, 3).map((tag, index) => (
                          <Tag key={index}>
                            <span className="text-xs">{tag}</span>
                          </Tag>
                        ))}
                        {character.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{character.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg glass-card hover:shadow-glow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.7)')}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg glass-card hover:shadow-glow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.7)')}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
