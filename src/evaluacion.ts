export interface NotasBimestres {
  bimestre1: number;
  bimestre2: number;
}

export interface EvaluacionSupletorio {
  requiereSupletorio: boolean;
  tieneDerechoSupletorio: boolean;
  notaMinimaRequerida: number;
}

export type EstadoFinal = 
  | 'APROBADO_DIRECTO'
  | 'REPROBADO_SIN_DERECHO'
  | 'PENDIENTE_SUPLETORIO'
  | 'APROBADO_SUPLETORIO'
  | 'REPROBADO_SUPLETORIO';

export interface ResultadoEvaluacion {
  sumaBimestres: number;
  estado: EstadoFinal;
  supletorio: EvaluacionSupletorio;
  mensajePrincipal: string;
}

const NOTA_MINIMA_BIMESTRE = 14;
const SUMA_MINIMA_ACCESO_SUPLETORIO = 18;
const NOTA_BASE_SUPLETORIO = 24;

/** Redondea a 2 decimales evitando errores de punto flotante. */
function redondear(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function evaluarEstudiante(
  bimestre1: number,
  bimestre2: number,
  notaSupletorioObtenida?: number
): ResultadoEvaluacion {
  const sumaBimestres = redondear(bimestre1 + bimestre2);
  const apruebaDirecto = bimestre1 >= NOTA_MINIMA_BIMESTRE && bimestre2 >= NOTA_MINIMA_BIMESTRE;

  // Caso 1: Aprueba directamente sin ir a supletorio
  if (apruebaDirecto) {
    return {
      sumaBimestres,
      estado: 'APROBADO_DIRECTO',
      supletorio: {
        requiereSupletorio: false,
        tieneDerechoSupletorio: false,
        notaMinimaRequerida: 0,
      },
      mensajePrincipal: '🎉 ¡Felicidades! Has aprobado la materia directamente.',
    };
  }

  // Caso 2: Al menos un bimestre < 14, verificar derecho a supletorio
  if (sumaBimestres < SUMA_MINIMA_ACCESO_SUPLETORIO) {
    return {
      sumaBimestres,
      estado: 'REPROBADO_SIN_DERECHO',
      supletorio: {
        requiereSupletorio: true,
        tieneDerechoSupletorio: false,
        notaMinimaRequerida: 0,
      },
      mensajePrincipal: `❌ Reprobado. Tu sumatoria es ${sumaBimestres} y necesitas mínimo ${SUMA_MINIMA_ACCESO_SUPLETORIO} para acceder al supletorio.`,
    };
  }

  // Caso 3: Tiene derecho a supletorio
  // Fórmula: NotaFinal = (NotaMinima * 2) - Sumatoria notas
  // Con NotaMinima = 24: (24 * 2) - Suma
  const notaCalculada = (NOTA_BASE_SUPLETORIO * 2) - sumaBimestres;
  // La nota mínima no puede ser inferior a 24
  const notaRequerida = redondear(Math.max(NOTA_BASE_SUPLETORIO, notaCalculada));

  // Si aún no ingresa la nota del examen supletorio
  if (notaSupletorioObtenida === undefined || isNaN(notaSupletorioObtenida)) {
    return {
      sumaBimestres,
      estado: 'PENDIENTE_SUPLETORIO',
      supletorio: {
        requiereSupletorio: true,
        tieneDerechoSupletorio: true,
        notaMinimaRequerida: notaRequerida,
      },
      mensajePrincipal: `⚠️ Tienes derecho a supletorio. Debes obtener al menos ${notaRequerida} puntos para aprobar.`,
    };
  }

  // Evaluar resultado con nota de supletorio ingresada
  if (notaSupletorioObtenida >= notaRequerida && notaSupletorioObtenida >= NOTA_BASE_SUPLETORIO) {
    return {
      sumaBimestres,
      estado: 'APROBADO_SUPLETORIO',
      supletorio: {
        requiereSupletorio: true,
        tieneDerechoSupletorio: true,
        notaMinimaRequerida: notaRequerida,
      },
      mensajePrincipal: '✅ ¡Aprobado en examen supletorio!',
    };
  }

  return {
    sumaBimestres,
    estado: 'REPROBADO_SUPLETORIO',
    supletorio: {
      requiereSupletorio: true,
      tieneDerechoSupletorio: true,
      notaMinimaRequerida: notaRequerida,
    },
    mensajePrincipal: `❌ Reprobaste el supletorio. Obtuviste ${redondear(notaSupletorioObtenida)} de los ${notaRequerida} puntos requeridos.`,
  };
}