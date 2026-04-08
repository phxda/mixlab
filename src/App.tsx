import Layout from './components/Layout';
import Hero from './components/Hero';
import IngredientSearch from './components/IngredientSearch';
import FlavorMap from './components/FlavorMap';
import SurpriseRoulette from './components/SurpriseRoulette';

function App() {
  return (
    <Layout>
      <Hero />
      <IngredientSearch />
      <FlavorMap />
      <SurpriseRoulette />
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
  );
}

export default App;
