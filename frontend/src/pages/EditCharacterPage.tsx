import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';
import characterService from '../services/characterService';
import ImageUpload from '../components/ImageUpload';

const EditCharacterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingCharacter, setFetchingCharacter] = useState(true);
  const [characterId, setCharacterId] = useState<string>(''); // Store actual MongoDB _id
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    backstory: '',
    avatarImage: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/admin');
      return;
    }

    // Fetch character data
    const fetchCharacter = async () => {
      if (!id) return;
      try {
        setFetchingCharacter(true);
        const response = await characterService.getById(id);
        const character = response.data;
        setCharacterId(character._id); // Store the actual MongoDB _id
        setFormData({
          name: character.name,
          about: character.about,
          backstory: character.backstory,
          avatarImage: character.avatarImage,
          tags: character.tags || [],
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load character');
      } finally {
        setFetchingCharacter(false);
      }
    };

    fetchCharacter();
  }, [navigate, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.about || !formData.backstory || !formData.avatarImage) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await characterService.update(characterId, formData); // Use the actual MongoDB _id
      navigate(`/character/${id}`); // Navigate back using the slug/id from URL
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cập nhật character thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  if (fetchingCharacter) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/character/${id}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors duration-200 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Quay lại</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-neon-blue mb-2">Chỉnh Sửa Character</h1>
              <p className="text-gray-400">Cập nhật thông tin nhân vật của bạn</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Main Info Card */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-neon-blue mb-4">Thông Tin Character</h2>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tên Character <span className="text-neon-blue">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-lighter border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all duration-300"
                  placeholder="Tên nhân vật"
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Giới Thiệu Ngắn <span className="text-neon-blue">*</span>
                </label>
                <input
                  type="text"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-lighter border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all duration-300"
                  placeholder="Mô tả ngắn gọn về nhân vật"
                />
              </div>

              {/* Backstory */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Câu Chuyện <span className="text-neon-blue">*</span>
                </label>
                <textarea
                  name="backstory"
                  value={formData.backstory}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 bg-dark-lighter border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all duration-300 resize-none"
                  placeholder="Câu chuyện chi tiết về nhân vật..."
                />
              </div>

              {/* Avatar Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ảnh Đại Diện <span className="text-neon-blue">*</span>
                </label>
                <ImageUpload
                  value={formData.avatarImage}
                  onChange={(url) => setFormData({ ...formData, avatarImage: url })}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 bg-dark-lighter border border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all duration-300"
                    placeholder="Thêm tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-6 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50 rounded-lg transition-all duration-300"
                  >
                    Thêm
                  </button>
                </div>
                
                {/* Tag List */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-neon-blue hover:bg-neon-blue/80 text-dark-900 font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang cập nhật...' : 'Cập Nhật Character'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/character/${id}`)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCharacterPage;
