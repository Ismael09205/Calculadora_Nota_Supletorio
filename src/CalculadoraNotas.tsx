import React, { useState, useMemo, type ChangeEvent } from 'react';
import { evaluarEstudiante, type ResultadoEvaluacion } from './evaluacion';

/* ---------- Reglas de entrada de notas ---------- */

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

  const esAprobado =
    resultado?.estado === 'APROBADO_DIRECTO' ||
    resultado?.estado === 'APROBADO_SUPLETORIO';

  return (
    <div className="pagina">
      <main className="tarjeta">
        {/* Encabezado */}
        <header className="encabezado">
          <span className="etiqueta-sistema">
            <span className="punto" />
            Sistema de evaluación
          </span>
          <h1 className="titulo">Calculadora de notas y supletorio</h1>
          <p className="subtitulo">
            Registra las notas de los dos bimestres del semestre para
            determinar si apruebas la materia, si tienes derecho a rendir el
            examen supletorio y qué nota necesitas para aprobarlo.
          </p>
        </header>

        {/* Notas del semestre */}
        <section className="seccion">
          <h2 className="titulo-seccion">Notas del semestre</h2>

          <div className="campos">
            <div>
              <label className="campo-label" htmlFor="b1">
                Nota del primer bimestre
              </label>
              <input
                id="b1"
                className="campo-input"
                type="text"
                inputMode="decimal"
                value={b1}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setB1(sanitizarNota(e.target.value))
                }
                placeholder="14.00"
              />
            </div>

            <div>
              <label className="campo-label" htmlFor="b2">
                Nota del segundo bimestre
              </label>
              <input
                id="b2"
                className="campo-input"
                type="text"
                inputMode="decimal"
                value={b2}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setB2(sanitizarNota(e.target.value))
                }
                placeholder="14.00"
              />
            </div>
          </div>

          <p className="nota-ayuda">
            Rango válido 0 – {NOTA_MAXIMA} · 2 decimales
          </p>
        </section>

        {/* Resultado */}
        <section className="seccion">
          <h2 className="titulo-seccion">Resultado de la evaluación</h2>

          {!resultado ? (
            <p className="vacio">
              Completa las dos notas para ver tu resultado.
            </p>
          ) : (
            <div className={`panel${esAprobado ? ' aprobado' : ''}`}>
              <p className="panel-mensaje">{resultado.mensajePrincipal}</p>

              <dl className="resumen">
                <div className="resumen-fila">
                  <dt className="resumen-termino">Sumatoria</dt>
                  <dd className="resumen-valor">
                    {resultado.sumaBimestres} pts
                  </dd>
                </div>

                {resultado.supletorio.tieneDerechoSupletorio && (
                  <div className="resumen-fila">
                    <dt className="resumen-termino">
                      Nota mínima en supletorio
                    </dt>
                    <dd className="resumen-valor">
                      {resultado.supletorio.notaMinimaRequerida} pts
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </section>
      </main>

      <p className="pie">
        Cada bimestre se aprueba con <strong>14</strong> puntos. El acceso al
        supletorio requiere <strong>18</strong> puntos entre ambos bimestres y
        la nota mínima para aprobarlo es <strong>24</strong>.
      </p>
    </div>
  );
};