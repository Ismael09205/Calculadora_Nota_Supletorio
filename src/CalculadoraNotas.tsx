import React, { useState, useMemo, type ChangeEvent } from 'react';
import { evaluarEstudiante, type ResultadoEvaluacion } from './evaluacion';

const NOTA_MAXIMA = 20;
const DECIMALES_PERMITIDOS = /^\d*\.?\d{0,2}$/;

/** Solo permite dígitos, un punto decimal y bloquea negativos y valores mayores a 20. */
function sanitizarNota(valor: string): string {
  const limpio = valor.replace(/[^0-9.]/g, '');
  if (!DECIMALES_PERMITIDOS.test(limpio)) return '';

  if (limpio.startsWith('.')) return `0${limpio}`;

  const numero = parseFloat(limpio);
  if (numero > NOTA_MAXIMA) return String(NOTA_MAXIMA);

  return limpio;
}

const estiloInput: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

export const CalculadoraNotas: React.FC = () => {
  const [b1, setB1] = useState<string>('');
  const [b2, setB2] = useState<string>('');

  const numB1 = parseFloat(b1);
  const numB2 = parseFloat(b2);

  const datosValidos =
    !isNaN(numB1) && !isNaN(numB2) && numB1 >= 0 && numB2 <= NOTA_MAXIMA;

  const resultado: ResultadoEvaluacion | null = useMemo(() => {
    if (!datosValidos) return null;
    return evaluarEstudiante(numB1, numB2);
  }, [numB1, numB2, datosValidos]);

  const getColorEstado = () => {
    if (!resultado) return '#6b7280';
    switch (resultado.estado) {
      case 'APROBADO_DIRECTO':
      case 'APROBADO_SUPLETORIO':
        return '#16a34a'; // Verde
      case 'REPROBADO_SIN_DERECHO':
      case 'REPROBADO_SUPLETORIO':
        return '#dc2626'; // Rojo
      case 'PENDIENTE_SUPLETORIO':
        return '#d97706'; // Ámbar/Naranja
    }
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '2rem auto',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#1f2937'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>
        Calculadora de Calificaciones
      </h2>

      {/* Inputs Bimestres */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="b1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Bimestre 1:
          </label>
          <input
            id="b1"
            type="text"
            inputMode="decimal"
            value={b1}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setB1(sanitizarNota(e.target.value))}
            placeholder="Ej. 14"
            style={estiloInput}
          />
        </div>

        <div>
          <label htmlFor="b2" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Bimestre 2:
          </label>
          <input
            id="b2"
            type="text"
            inputMode="decimal"
            value={b2}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setB2(sanitizarNota(e.target.value))}
            placeholder="Ej. 14"
            style={estiloInput}
          />
        </div>
      </div>

      <small style={{ display: 'block', marginBottom: '1rem', color: '#6b7280' }}>
        Las notas van de 0 a {NOTA_MAXIMA}.
      </small>

      {/* Panel de Resultados */}
      {resultado && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          borderRadius: '8px',
          backgroundColor: '#f9fafb',
          borderLeft: `5px solid ${getColorEstado()}`
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: getColorEstado(), fontSize: '1.1rem' }}>
            {resultado.mensajePrincipal}
          </h3>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#4b5563' }}>
            <strong>Sumatoria de bimestres:</strong> {resultado.sumaBimestres} puntos
          </p>
          {resultado.supletorio.tieneDerechoSupletorio && (
            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#4b5563' }}>
              <strong>Nota mínima en supletorio:</strong> {resultado.supletorio.notaMinimaRequerida} puntos
            </p>
          )}
        </div>
      )}
    </div>
  );
};