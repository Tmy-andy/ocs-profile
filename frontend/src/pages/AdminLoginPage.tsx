import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.login(formData);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1f] to-[#0a0a0f] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        {/* Main Card */}
        <div className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Side - Form */}
            <div className="p-12 lg:p-16 flex flex-col justify-center relative">
              {/* Logo/Brand */}
              <div className="absolute top-8 left-12">
                <h2 className="text-2xl font-bold text-gray-800">
                  OC<span className="text-blue-500">Profile</span>
                </h2>
                <div className="h-0.5 w-16 bg-blue-500 mt-1"></div>
              </div>

              {/* Welcome Text */}
              <div className="mb-8 mt-12">
                <h1 className="text-4xl lg:text-5xl font-light text-gray-800 mb-2">
                  + Welcome back
                </h1>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Input */}
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    placeholder="email"
                    className="w-full px-6 py-4 bg-transparent border-2 border-gray-300 rounded-full
                             text-gray-800 placeholder-gray-400 font-light
                             focus:outline-none focus:border-blue-500 transition-all duration-300
                             pr-12"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="password"
                    className="w-full px-6 py-4 bg-transparent border-2 border-gray-300 rounded-full
                             text-gray-800 placeholder-gray-400 font-light
                             focus:outline-none focus:border-blue-500 transition-all duration-300
                             pr-12"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                {/* Sign In Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-3.5 bg-gray-900 hover:bg-blue-500 text-white rounded-full
                             font-medium transition-all duration-300 disabled:opacity-50
                             shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>

              {/* Back to Home */}
              <div className="mt-8">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to home
                </button>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative overflow-hidden">
              {/* Butterfly Image - Full Size */}
              <img
                src="/blue-butterfly.png"
                alt="Blue Butterfly"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
