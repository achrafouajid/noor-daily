
import Hero from './components/Hero';
import Background from './components/Background';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />
      <main className="relative z-10">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

export default App;
