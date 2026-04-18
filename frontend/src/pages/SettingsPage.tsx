import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { User } from '../types';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    username: '',
    slug: '',
    displayName: '',
    email: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        const user = await authService.getCurrentUser();
        setMe({ ...user, token: authService.getToken() || '' });
        setProfileForm({
          username: user.username || '',
          slug: user.slug || '',
          displayName: user.displayName || '',
          email: user.email || '',
        });
      } catch (error: any) {
        if (error.response?.status === 401) {
          authService.logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileSaving(true);

    const payload: Record<string, string> = {};
    if (me) {
      if (profileForm.username !== me.username) payload.username = profileForm.username;
      if (profileForm.slug !== (me.slug || '')) payload.slug = profileForm.slug;
      if (profileForm.displayName !== (me.displayName || '')) payload.displayName = profileForm.displayName;
      if (profileForm.email !== (me.email || '')) payload.email = profileForm.email;
    }

    if (Object.keys(payload).length === 0) {
      setProfileError('Không có thay đổi nào');
      setProfileSaving(false);
      return;
    }

    try {
      const updated = await authService.updateProfile(payload);
      setMe({ ...updated, token: authService.getToken() || '' });
      setProfileSuccess('Cập nhật thành công');
    } catch (error: any) {
      const msg = error.response?.data?.errors?.[0] || error.response?.data?.message || 'Cập nhật thất bại';
      setProfileError(msg);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới nhập lại không khớp');
      return;
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setPasswordError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    setPasswordSaving(true);
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      alert('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      authService.logout();
      navigate('/login');
    } catch (error: any) {
      const msg = error.response?.data?.errors?.[0] || error.response?.data?.message || 'Đổi mật khẩu thất bại';
      setPasswordError(msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-neon-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Cài đặt tài khoản</h1>
            <p className="text-sm text-gray-500">Quản lý profile và mật khẩu</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Thông tin profile</h2>
          <p className="text-sm text-gray-500 mb-6">Slug được dùng làm URL hồ sơ: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/{profileForm.slug || 'slug'}</code></p>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {profileError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{profileError}</div>
            )}
            {profileSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{profileSuccess}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username (dùng để đăng nhập)</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                pattern="^[a-zA-Z0-9_]+$"
                minLength={3}
                maxLength={30}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">3–30 ký tự. Chữ, số, underscore.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL hồ sơ)</label>
              <input
                type="text"
                value={profileForm.slug}
                onChange={(e) => setProfileForm({ ...profileForm, slug: e.target.value.toLowerCase() })}
                pattern="^[a-z0-9-]+$"
                minLength={3}
                maxLength={40}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">3–40 ký tự. Chữ thường, số, dấu gạch ngang.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
              <input
                type="text"
                value={profileForm.displayName}
                onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                maxLength={50}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="px-5 py-2.5 bg-neon-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {profileSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Đổi mật khẩu</h2>
          <p className="text-sm text-gray-500 mb-6">Sau khi đổi, bạn sẽ phải đăng nhập lại.</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{passwordError}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Ít nhất 6 ký tự"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu mới</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="px-5 py-2.5 bg-neon-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {passwordSaving ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
