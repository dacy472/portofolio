import { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import { useReveal } from './hooks/useReveal';

// Pages & Components
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';

function App() {
  const navRef = useRef(null);
  useReveal(navRef);

  return (
    <Router>
      <div className="app">
        <CursorGlow />
        <nav className="glass-panel nav-header" ref={navRef}>
          <div className="container nav-container">
            <div className="reveal-item" data-motion="drop" data-delay="0">
              <Link to="/" className="logo text-gradient">CR</Link>
            </div>
            <div className="nav-links reveal-item" data-motion="drop" data-delay="140">
              <Link to="/">Home</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
