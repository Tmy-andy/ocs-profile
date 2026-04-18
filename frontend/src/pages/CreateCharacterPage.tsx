import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import characterService from '../services/characterService';
import CharacterForm from '../components/CharacterForm';

const CreateCharacterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      await characterService.create(payload);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <button onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-400 hover:text-neon-blue mb-4">
            <span className="text-xl">←</span>
            <span>Quay lại</span>
          </button>
          <h1 className="text-4xl font-bold mb-2"
              style={{
                background: 'linear-gradient(to right, #00d4ff, #3b82f6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
            Tạo Character Mới
          </h1>
          <p className="text-gray-400">Chỉ cần tên là đủ. Các mục khác điền thêm khi muốn.</p>
        </div>

        <CharacterForm
          submitLabel="✨ Tạo Character"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin')}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CreateCharacterPage;
