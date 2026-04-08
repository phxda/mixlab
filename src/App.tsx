import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Explore = lazy(() => import('./pages/Explore'));
const Surprise = lazy(() => import('./pages/Surprise'));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/surprise" element={<Surprise />} />
          </Routes>
        </Suspense>
        <footer
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: 'rgba(240, 230, 255, 0.2)',
            fontSize: '13px',
          }}
        >
          Made with love and a little Bacardi. Hello, Hannah. I wasn't lying when I said CS was whimsical. -Phil
        </footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
