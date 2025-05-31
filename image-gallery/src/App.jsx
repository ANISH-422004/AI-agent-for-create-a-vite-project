import { Routes, Route, Link } from 'react-router-dom';
import Gallery from './pages/Gallery';
import ImageDetail from './pages/ImageDetail';

function App() {
  return (
    <div className="bg-dark text-light min-vh-100">
      <nav className="navbar navbar-expand navbar-dark bg-secondary mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">Image Gallery</Link>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/image/:id" element={<ImageDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;