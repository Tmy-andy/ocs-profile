import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';
import characterService from '../services/characterService';
import CharacterForm from '../components/CharacterForm';
import { Character } from '../types';

const EditCharacterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    (async () => {
      if (!id) return;
      try {
        const response = await characterService.getById(id);
        setCharacter(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load character');
      } finally {
        setFetching(false);
      }
    })();
  }, [navigate, id]);

  const handleSubmit = async (payload: any) => {
    if (!character) return;
    setLoading(true);
    setError(null);
    try {
      await characterService.update(character._id, payload);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error || 'Character not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-400 hover:text-neon-blue mb-4">
            <span>←</span><span>Quay lại</span>
          </button>
          <h1 className="text-4xl font-bold text-neon-blue mb-2">Chỉnh Sửa: {character.name}</h1>
        </div>

        <CharacterForm
          initial={character}
          submitLabel="Cập Nhật"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin')}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default EditCharacterPage;
