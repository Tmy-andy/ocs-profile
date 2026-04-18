import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Character } from '../types';
import characterService from '../services/characterService';
import authService from '../services/authService';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const CharacterPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await characterService.getById(id);
      setCharacter(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load character');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <ErrorMessage message={error} onRetry={fetchCharacter} />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <ErrorMessage message="Character not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1f] to-[#0a0a0f] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button and Edit Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Quay lại</span>
          </button>

          {/* Edit Button - Only show if admin is logged in */}
          {authService.isAuthenticated() && (
            <button
              onClick={() => navigate(`/edit/${character._id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50 rounded-lg transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-[500px_1fr] gap-6">
          {/* Left Column - Avatar */}
          <div className="relative">
            <div className="sticky top-8">
              {/* Decorative corners */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 z-10" 
                   style={{ 
                     borderColor: '#00d4ff',
                     filter: 'drop-shadow(0 0 6px #00d4ff) drop-shadow(0 0 10px #00d4ff)',
                   }}></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 z-10" 
                   style={{ 
                     borderColor: '#00d4ff',
                     filter: 'drop-shadow(0 0 6px #00d4ff) drop-shadow(0 0 10px #00d4ff)',
                   }}></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 z-10" 
                   style={{ 
                     borderColor: '#00d4ff',
                     filter: 'drop-shadow(0 0 6px #00d4ff) drop-shadow(0 0 10px #00d4ff)',
                   }}></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 z-10" 
                   style={{ 
                     borderColor: '#00d4ff',
                     filter: 'drop-shadow(0 0 6px #00d4ff) drop-shadow(0 0 10px #00d4ff)',
                   }}></div>

              {/* Avatar Container with gradient border */}
              <div className="relative p-[3px] rounded-2xl" 
                   style={{ 
                     background: 'linear-gradient(135deg, #00d4ff, #3b82f6, #00d4ff)',
                   }}>
                <div className="bg-dark rounded-2xl overflow-hidden">
                  <img
                    src={character.avatarImage}
                    alt={character.name}
                    className="w-full aspect-[3/4] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x667?text=No+Image';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Header with Title */}
            <div>
              <h1 className="text-5xl font-bold mb-2 tracking-tight"
                  style={{
                    background: 'linear-gradient(to right, #00d4ff, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                {character.name}
              </h1>
              <p className="text-gray-500 text-sm font-mono">
                Character ID | {character.slug || character.characterId}
              </p>
            </div>

            {/* About Section */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-dark-lighter/80 to-dark/80 border-2 backdrop-blur-sm" 
                 style={{ 
                   borderColor: '#00d4ff',
                   boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)'
                 }}>
              <h2 className="text-neon-blue text-sm font-bold uppercase tracking-wider mb-3">
                ABOUT
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                "{character.about}"
              </p>
            </div>

            {/* Backstory Section */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-dark-lighter/80 to-dark/80 border-2 backdrop-blur-sm" 
                 style={{ 
                   borderColor: '#00d4ff',
                   boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)'
                 }}>
              <h2 className="text-neon-blue text-sm font-bold uppercase tracking-wider mb-3">
                BACKSTORY
              </h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {character.backstory}
              </div>
            </div>

            {/* Tags Section */}
            {character.tags && character.tags.length > 0 && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-dark-lighter/80 to-dark/80 border-2 backdrop-blur-sm" 
                   style={{ 
                     borderColor: '#00d4ff',
                     boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)'
                   }}>
                <h2 className="text-neon-blue text-sm font-bold uppercase tracking-wider mb-4">
                  TAGS
                </h2>
                <div className="flex flex-wrap gap-2">
                  {character.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full border-2 text-neon-blue text-sm font-medium transition-all duration-300 cursor-default"
                      style={{ 
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderColor: '#00d4ff',
                        boxShadow: '0 0 6px rgba(0, 212, 255, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
