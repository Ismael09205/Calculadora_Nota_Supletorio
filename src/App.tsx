import { CalculadoraNotas } from './CalculadoraNotas';

export function App() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '1rem'
    }}>
      <CalculadoraNotas />
    </main>
  );
}

export default App;
