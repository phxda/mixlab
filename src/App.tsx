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
        Made with love and a little rum. Drink responsibly.
      </footer>
    </Layout>
  );
}

export default App;
