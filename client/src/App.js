import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router> {/* Wrap your entire application with the Router */}
      <main className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
}

export default App;
