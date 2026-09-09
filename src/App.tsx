import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Test } from './pages/Test';
import { Results } from './pages/Results';
import { Practice } from './pages/Practice';
import { History } from './pages/History';
import { Statistics } from './pages/Statistics';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="h-screen w-screen bg-type-bg text-type-text overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/results" element={<Results />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/history" element={<History />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
