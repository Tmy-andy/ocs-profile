import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import characterService from '../services/characterService';
import authService from '../services/authService';
import userService from '../services/userService';
import { Character, User, UserSummary } from '../types';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteExpiresAt, setInviteExpiresAt] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userDeleteLoading, setUserDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setMe({ ...currentUser, token: authService.getToken() || '' });

        await fetchCharacters(currentUser.slug || currentUser.username);

        if (currentUser.role === 'admin') {
          await fetchUsers();
        }
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          authService.logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const fetchCharacters = async (ownerUsername: string) => {
    try {
      const data = await characterService.getAll({ page: 1, limit: 100, owner: ownerUsername });
      setCharacters(data.data);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string, charCount: number) => {
    const msg = charCount > 0
      ? `Xóa user "${username}" sẽ xóa luôn ${charCount} character của họ. Tiếp tục?`
      : `Xóa user "${username}"?`;
    if (!window.confirm(msg)) return;

    setUserDeleteLoading(userId);
    try {
      await userService.delete(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Xóa user thất bại');
    } finally {
      setUserDeleteLoading(null);
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
    navigate(`/edit/${character._id}`);
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
                onClick={() => navigate('/settings')}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Cài đặt</span>
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
                            <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{character.core?.occupation || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded">{character.slug}</code>
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

        {/* Users Table (admin only) */}
        {me?.role === 'admin' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Danh sách Users</h2>
                <p className="text-sm text-gray-500 mt-0.5">Xóa user sẽ xóa luôn toàn bộ character của họ</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-neon-blue text-sm rounded-lg border border-blue-100">
                {users.length} users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên hiển thị</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Characters</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                        Đang tải...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                        Chưa có user nào
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{u.username}</span>
                          {me?.id === u._id && (
                            <span className="ml-2 text-xs text-gray-400">(you)</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{u.displayName || '—'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{u.email || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-md border ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{u.charactersCount}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleDeleteUser(u._id, u.username, u.charactersCount)}
                              disabled={userDeleteLoading === u._id || me?.id === u._id}
                              className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                              title={me?.id === u._id ? 'Không thể xóa chính mình' : ''}
                            >
                              {userDeleteLoading === u._id ? '...' : 'Xóa'}
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
        )}
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

              {selectedCharacter.backstory && (
                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2">Backstory</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedCharacter.backstory}</p>
                </div>
              )}

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
                  <code className="text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded">{selectedCharacter.slug}</code>
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
                      className="w-full px-4 py-3 pr-24 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-mono"
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
