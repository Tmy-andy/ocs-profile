import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CharacterPage from './pages/CharacterPage';
import CreateCharacterPage from './pages/CreateCharacterPage';
import EditCharacterPage from './pages/EditCharacterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import RegisterPage from './pages/RegisterPage';
import UserCharactersPage from './pages/UserCharactersPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateCharacterPage />} />
          <Route path="/edit/:id" element={<EditCharacterPage />} />
          <Route path="/character/:id" element={<CharacterPage />} />
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/register/:token" element={<RegisterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/:slug" element={<UserCharactersPage />} />
          <Route path="/:slug/character/:characterSlug" element={<CharacterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
