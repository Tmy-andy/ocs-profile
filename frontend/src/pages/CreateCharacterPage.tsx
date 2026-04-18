import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import characterService from '../services/characterService';
import Card from '../components/Card';
import ImageUpload from '../components/ImageUpload';

const CreateCharacterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    avatarImage: '',
    about: '',
    backstory: '',
    tags: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const characterData = {
        name: formData.name,
        avatarImage: formData.avatarImage,
        about: formData.about,
        backstory: formData.backstory,
        tags: tagsArray,
      };

      await characterService.create(characterData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors duration-200 mb-4"
          >
            <span className="text-xl">←</span>
            <span>Quay lại</span>
          </button>
          <h1 className="text-4xl font-bold mb-2"
              style={{
                background: 'linear-gradient(to right, #00d4ff, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Tạo Character Mới
          </h1>
          <p className="text-gray-400">Điền thông tin để tạo OC character của bạn</p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 border-red-500/50 bg-red-500/10">
            <p className="text-red-400">❌ {error}</p>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-neon-blue mb-4">Thông Tin Character</h2>
            
            {/* Character Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tên Character <span className="text-neon-blue">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="VD: Lac Phong"
                className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(0, 212, 255, 0.5)';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Avatar URL */}
            <div className="mb-4">
              <ImageUpload
                label="Ảnh Avatar"
                value={formData.avatarImage}
                onChange={(url) => setFormData(prev => ({ ...prev, avatarImage: url }))}
                error={error && !formData.avatarImage ? 'Vui lòng chọn ảnh hoặc nhập URL' : ''}
              />
            </div>

            {/* About */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Giới Thiệu Ngắn <span className="text-neon-blue">*</span>
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                required
                maxLength={500}
                rows={3}
                placeholder="Câu nói hoặc mô tả ngắn về character..."
                className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none transition-all resize-none"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(0, 212, 255, 0.5)';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.about.length}/500 ký tự</p>
            </div>

            {/* Backstory */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Câu Chuyện <span className="text-neon-blue">*</span>
              </label>
              <textarea
                name="backstory"
                value={formData.backstory}
                onChange={handleChange}
                required
                maxLength={2000}
                rows={6}
                placeholder="Viết câu chuyện chi tiết về character..."
                className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none transition-all resize-none"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00d4ff';
                  e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 212, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '';
                }}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.backstory.length}/2000 ký tự</p>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="VD: Male, Xianxia, Ancient setting, Humor"
                className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.boxShadow = '0 0 8px rgba(0, 212, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = '';
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 10 tags</p>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg glass-card hover:border-white/30 transition-all"
            >
              Hủy
            </button>
              <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-neon-blue hover:bg-neon-blue/80 text-dark-900 font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang tạo...' : '✨ Tạo Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacterPage;
