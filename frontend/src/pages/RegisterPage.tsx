import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';

type Status = 'verifying' | 'invalid' | 'expired' | 'ready' | 'submitting' | 'done';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [status, setStatus] = useState<Status>('verifying');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    authService
      .verifyInvite(token)
      .then((data) => {
        setExpiresAt(data.expiresAt);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.response?.status === 410) {
          setStatus('expired');
        } else {
          setStatus('invalid');
        }
      });
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      await authService.register(token, formData);
      setStatus('done');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.errors?.[0] || err.response?.data?.message || 'Đăng ký thất bại';
      setError(msg);
      setStatus('ready');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-neon-blue rounded-full animate-spin"></div>
          <p className="text-gray-600">Đang xác thực link...</p>
        </div>
      </div>
    );
  }

  if (status === 'invalid' || status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'expired' ? 'Link đã hết hạn' : 'Link không hợp lệ'}
          </h1>
          <p className="text-gray-600 mb-6">
            {status === 'expired'
              ? 'Link đăng ký này đã quá 48 tiếng. Vui lòng liên hệ admin để lấy link mới.'
              : 'Link đăng ký này không tồn tại hoặc đã được sử dụng.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-neon-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h1>
          <p className="text-gray-600">Đang chuyển hướng đến dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-md w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản</h1>
          <p className="text-gray-500 text-sm">
            Hoàn thành form để kích hoạt tài khoản.
          </p>
          {expiresAt && (
            <p className="text-xs text-gray-400 mt-2">
              Link hết hạn: {new Date(expiresAt).toLocaleString('vi-VN')}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9_]+"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none"
              placeholder="chỉ chữ, số, underscore"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên hiển thị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
              maxLength={50}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none"
              placeholder="ít nhất 6 ký tự"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhập lại mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full mt-2 px-4 py-3 bg-neon-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {status === 'submitting' ? 'Đang tạo...' : 'Tạo tài khoản'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
