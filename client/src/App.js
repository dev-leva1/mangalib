import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Компоненты
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Catalog from './components/pages/Catalog';
import MangaDetail from './components/manga/MangaDetail';
import ChapterReader from './components/manga/ChapterReader';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './components/pages/NotFound';

// Стили
import GlobalStyle from './styles/GlobalStyle';
import { darkTheme } from './styles/themes';

// Проверка наличия токена
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = ({ loadUser }) => {
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/manga/:id" element={<MangaDetail />} />
              <Route path="/manga/:mangaId/chapter/:chapterId" element={<ChapterReader />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<PrivateRoute component={Profile} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default connect(null, { loadUser })(App); 