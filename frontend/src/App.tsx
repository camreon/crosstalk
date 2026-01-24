import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './reducers/hooks';
import { restoreUser } from './reducers/userReducer';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TopicsPage from './pages/TopicsPage';
import SurveyPage from './pages/SurveyPage';
import ProfilePage from './pages/ProfilePage';
import ComparePage from './pages/ComparePage';
import CompareResultPage from './pages/CompareResultPage';

function App() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    // Restore user from localStorage on app load
    const savedUser = localStorage.getItem('crosstalk_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch(restoreUser(user));
      } catch (e) {
        localStorage.removeItem('crosstalk_user');
      }
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={currentUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/topics" element={currentUser ? <TopicsPage /> : <Navigate to="/login" />} />
        <Route path="/survey/:topicId" element={currentUser ? <SurveyPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/compare" element={currentUser ? <ComparePage /> : <Navigate to="/login" />} />
        <Route path="/compare/result" element={currentUser ? <CompareResultPage /> : <Navigate to="/login" />} />
      </Route>
    </Routes>
  );
}

export default App;
