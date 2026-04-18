import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Character } from '../types';
import characterService from '../services/characterService';
import Card from '../components/Card';
import Tag from '../components/Tag';
import ErrorMessage from '../components/ErrorMessage';

const UserCharactersPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [ownerDisplay, setOwnerDisplay] = useState<string | null>(null);

  const fetchCharacters = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const response = await characterService.getAll({
        page,
        limit: 12,
        search: search || undefined,
        owner: slug,
      });
      setCharacters(response.data);
      setTotalPages(response.pagination.pages);

      const firstWithOwner = response.data.find(
        (c) => c.owner && typeof c.owner === 'object'
      );
      if (firstWithOwner && typeof firstWithOwner.owner === 'object') {
        setOwnerDisplay(firstWithOwner.owner.displayName || firstWithOwner.owner.username);
      } else {
        setOwnerDisplay(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [slug, page, search]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors duration-200 mb-4"
        >
          <span className="text-xl">←</span>
          <span>Về trang chủ</span>
        </button>

        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Bộ sưu tập của</p>
          <h1
            className="text-4xl md:text-6xl font-bold mb-2"
            style={{
              background: 'linear-gradient(to right, #00d4ff, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {ownerDisplay || `@${slug}`}
          </h1>
          {ownerDisplay && <p className="text-gray-500 text-sm">@{slug}</p>}
        </div>

        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Tìm character..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-6 py-4 rounded-xl bg-dark-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all duration-300"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {error && <ErrorMessage message={error} onRetry={fetchCharacters} />}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-xl">
              Không tìm thấy character nào của @{slug}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {characters.map((character) => (
                <Card
                  key={character._id}
                  hover
                  className="cursor-pointer p-0 overflow-hidden group"
                  onClick={() =>
                    navigate(`/${slug}/character/${character.slug || character._id}`)
                  }
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={character.avatarImage}
                      alt={character.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                        {character.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">{character.about}</p>
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

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg glass-card hover:shadow-glow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default UserCharactersPage;
