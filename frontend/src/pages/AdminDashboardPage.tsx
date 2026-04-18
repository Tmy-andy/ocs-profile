import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import characterService from '../services/characterService';
import authService from '../services/authService';
import { Character } from '../types';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    avatarImage: '',
    about: '',
    backstory: '',
    tags: [] as string[],
  });
  const [editLoading, setEditLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteExpiresAt, setInviteExpiresAt] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    // Check if authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchCharacters();
  }, [navigate]);

  const fetchCharacters = async () => {
    try {
      const data = await characterService.getAll({ page: 1, limit: 100 });
      setCharacters(data.data);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${name}"?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      await characterService.delete(id);
      setCharacters(characters.filter(c => c._id !== id));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Xóa thất bại');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditClick = (character: Character) => {
    setEditingCharacter(character);
    setEditFormData({
      name: character.name,
      avatarImage: character.avatarImage,
      about: character.about,
      backstory: character.backstory,
      tags: character.tags,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && editFormData.tags.length < 10) {
      setEditFormData({
        ...editFormData,
        tags: [...editFormData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setEditFormData({
      ...editFormData,
      tags: editFormData.tags.filter((_, i) => i !== index),
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharacter) return;

    setEditLoading(true);
    try {
      await characterService.update(editingCharacter._id, editFormData);
      // Refresh characters list
      await fetchCharacters();
      setEditingCharacter(null);
      alert('Cập nhật thành công!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleCreateInvite = async () => {
    setInviteOpen(true);
    setInviteLink(null);
    setInviteExpiresAt(null);
    setInviteLoading(true);
    try {
      const invite = await authService.createInvite();
      const link = `${window.location.origin}/register/${invite.token}`;
      setInviteLink(link);
      setInviteExpiresAt(invite.expiresAt);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Tạo link thất bại');
      setInviteOpen(false);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCopyInvite = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      alert('Không thể copy. Hãy copy thủ công.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-neon-blue rounded-full animate-spin"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Quản lý characters</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Trang chủ</span>
              </button>
              
              <button
                onClick={handleCreateInvite}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Tạo tài khoản</span>
              </button>

              <button
                onClick={() => navigate('/create')}
                className="px-5 py-2.5 bg-neon-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tạo mới</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng Characters</p>
                <p className="text-3xl font-bold text-gray-900">{characters.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng Tags</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(characters.flatMap(c => c.tags)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mới nhất</p>
                <p className="text-3xl font-bold text-gray-900">
                  {characters.length > 0 ? new Date(characters[0].createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '--'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Characters Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách Characters</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Character
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {characters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="text-gray-500">Chưa có character nào</p>
                        <button
                          onClick={() => navigate('/create')}
                          className="mt-2 px-4 py-2 bg-neon-blue hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          Tạo character đầu tiên
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  characters.map((character) => (
                    <tr key={character._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={character.avatarImage}
                            alt={character.name}
                            className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-100"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{character.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{character.about}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{character.slug}</code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {character.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-50 text-neon-blue text-xs rounded-md border border-blue-100">
                              {tag}
                            </span>
                          ))}
                          {character.tags.length > 2 && (
                            <span className="px-2 py-1 text-gray-400 text-xs">
                              +{character.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(character.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedCharacter(character)}
                            className="px-3 py-1.5 text-gray-700 hover:text-neon-blue hover:bg-blue-50 rounded-lg text-sm transition-all"
                          >
                            Xem
                          </button>
                          <button
                            onClick={() => handleEditClick(character)}
                            className="px-3 py-1.5 text-gray-700 hover:text-neon-blue hover:bg-blue-50 rounded-lg text-sm transition-all"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(character._id, character.name)}
                            disabled={deleteLoading === character._id}
                            className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-all disabled:opacity-50"
                          >
                            {deleteLoading === character._id ? '...' : 'Xóa'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Character View Modal */}
      {selectedCharacter && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCharacter(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCharacter.name}</h2>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Avatar Image */}
              <div>
                <p className="text-base font-semibold text-gray-800 mb-2">Avatar</p>
                <img
                  src={selectedCharacter.avatarImage}
                  alt={selectedCharacter.name}
                  className="w-full max-w-md mx-auto rounded-xl object-cover"
                />
              </div>

              {/* About */}
              <div>
                <p className="text-base font-semibold text-gray-800 mb-2">Giới thiệu</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedCharacter.about}</p>
              </div>

              {/* Backstory */}
              <div>
                <p className="text-base font-semibold text-gray-800 mb-2">Câu chuyện</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedCharacter.backstory}</p>
              </div>

              {/* Tags */}
              <div>
                <p className="text-base font-semibold text-gray-800 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCharacter.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-50 text-neon-blue text-sm rounded-lg border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Slug</p>
                  <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">{selectedCharacter.slug}</code>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Ngày tạo</p>
                  <p className="text-gray-900 text-sm">{new Date(selectedCharacter.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedCharacter(null);
                    navigate(`/edit/${selectedCharacter._id}`);
                  }}
                  className="flex-1 px-4 py-2.5 bg-neon-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => setSelectedCharacter(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Character Modal */}
      {editingCharacter && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditingCharacter(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa: {editingCharacter.name}</h2>
              <button
                onClick={() => setEditingCharacter(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Character <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Avatar <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="avatarImage"
                  value={editFormData.avatarImage}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                />
                {editFormData.avatarImage && (
                  <img src={editFormData.avatarImage} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                )}
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới thiệu <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="about"
                  value={editFormData.about}
                  onChange={handleEditChange}
                  required
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{editFormData.about.length}/500</p>
              </div>

              {/* Backstory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Câu chuyện <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="backstory"
                  value={editFormData.backstory}
                  onChange={handleEditChange}
                  required
                  maxLength={2000}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{editFormData.backstory.length}/2000</p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (tối đa 10)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Nhập tag và Enter"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                    disabled={editFormData.tags.length >= 10}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={editFormData.tags.length >= 10}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editFormData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-neon-blue text-sm rounded-lg border border-blue-100 flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-2.5 bg-neon-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {editLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCharacter(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setInviteOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Link đăng ký</h2>
              <button
                onClick={() => setInviteOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {inviteLoading ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-neon-blue rounded-full animate-spin"></div>
                  <p className="text-gray-600 text-sm">Đang tạo link...</p>
                </div>
              ) : inviteLink ? (
                <>
                  <p className="text-sm text-gray-600">
                    Gửi link này cho người bạn muốn mời. Link có hiệu lực <strong>48 tiếng</strong> và chỉ dùng được <strong>một lần</strong>.
                  </p>

                  <div className="relative">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="w-full px-4 py-3 pr-24 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 font-mono"
                      onFocus={(e) => e.target.select()}
                    />
                    <button
                      onClick={handleCopyInvite}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-neon-blue hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      {copyFeedback ? 'Đã copy!' : 'Copy'}
                    </button>
                  </div>

                  {inviteExpiresAt && (
                    <p className="text-xs text-gray-500">
                      Hết hạn lúc: {new Date(inviteExpiresAt).toLocaleString('vi-VN')}
                    </p>
                  )}

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      ⚠️ Sau khi người được mời đăng ký xong, link này sẽ tự động vô hiệu.
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
