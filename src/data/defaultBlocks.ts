import type { MarkdownBlock } from '../theme/schema';

function block(id: string, label: string, markdown: string): MarkdownBlock {
  return { id, label, markdown };
}

export const DEFAULT_BLOCKS: MarkdownBlock[] = [
  block(
    'title',
    'Título (H1)',
    '# La Revolución de la Inteligencia Artificial en la Medicina Moderna',
  ),
  block(
    'intro',
    'Introducción',
    'La inteligencia artificial está transformando radicalmente el panorama de la atención médica. Desde el diagnóstico temprano de enfermedades hasta la personalización de tratamientos, los algoritmos de aprendizaje automático están demostrando capacidades que antes parecían imposibles.',
  ),
  block(
    'h2-diagnostico',
    'Sección H2 — Diagnóstico',
    '## Diagnóstico Asistido por IA',
  ),
  block(
    'p-diagnostico',
    'Párrafo — Diagnóstico',
    'Los sistemas de IA pueden analizar imágenes médicas con una precisión que rivaliza, y en algunos casos supera, la de radiólogos experimentados. Esto es especialmente relevante en la detección de cánceres y enfermedades cardiovasculares.',
  ),
  block(
    'h3-cancer',
    'Subsección H3 — Cáncer',
    '### Detección Temprana del Cáncer',
  ),
  block(
    'p-cancer',
    'Párrafo — Cáncer',
    'Estudios recientes muestran que los algoritmos de visión por computadora pueden identificar tumores malignos en mamografías con un **95% de precisión**, reduciendo significativamente los falsos positivos que generan *ansiedad innecesaria* en los pacientes.',
  ),
  block(
    'ul-cancer',
    'Lista desordenada',
    '- Reducción del 30% en diagnósticos erróneos\n- Tiempo de análisis reducido de horas a minutos\n- Mayor accesibilidad en zonas rurales mediante telemedicina',
  ),
  block(
    'h3-cardiaco',
    'Subsección H3 — Cardiología',
    '### Análisis de Imágenes Cardíacas',
  ),
  block(
    'p-cardiaco',
    'Párrafo — Cardiología',
    'La IA también está revolucionando la cardiología. Los modelos pueden predecir eventos cardiovasculares analizando electrocardiogramas y ecocardiogramas, identificando patrones sutiles que podrían pasar desapercibidos.',
  ),
  block(
    'h2-personalizada',
    'Sección H2 — Medicina personalizada',
    '## Medicina Personalizada y Genómica',
  ),
  block(
    'p-personalizada',
    'Párrafo — Medicina personalizada',
    'Uno de los avances más prometedores es la capacidad de la IA para procesar enormes cantidades de datos genéticos y crear planes de tratamiento personalizados para cada paciente.',
  ),
  block(
    'blockquote',
    'Cita',
    '> "La medicina del futuro no tratará enfermedades, tratará pacientes individuales con sus características únicas genéticas y ambientales."\n> — Dr. Sarah Chen, Instituto de Medicina Genómica',
  ),
  block(
    'h3-farmacogenomica',
    'Subsección H3 — Farmacogenómica',
    '### Farmacogenómica',
  ),
  block(
    'p-farmacogenomica',
    'Párrafo — Farmacogenómica',
    'Los algoritmos pueden predecir cómo responderá un paciente específico a diferentes medicamentos basándose en su perfil genético, evitando ***reacciones adversas*** y optimizando la eficacia del tratamiento.',
  ),
  block(
    'ol-farmacogenomica',
    'Lista ordenada',
    '1. Análisis del genoma completo del paciente\n2. Identificación de marcadores genéticos relevantes\n3. Predicción de respuesta a fármacos específicos\n4. Ajuste de dosis personalizado\n5. Monitoreo continuo y adaptación del tratamiento',
  ),
  block(
    'h2-eticos',
    'Sección H2 — Desafíos éticos',
    '## Desafíos Éticos y Regulatorios',
  ),
  block(
    'p-eticos',
    'Párrafo — Desafíos éticos',
    'A pesar de sus beneficios, la implementación de IA en medicina plantea importantes cuestiones éticas que deben abordarse cuidadosamente.',
  ),
  block(
    'h3-privacidad',
    'Subsección H3 — Privacidad',
    '### Privacidad de Datos',
  ),
  block(
    'p-privacidad',
    'Párrafo — Privacidad',
    'El uso de grandes cantidades de datos médicos sensibles requiere protocolos estrictos de seguridad. Los sistemas deben cumplir con regulaciones como ~~HIPAA~~ GDPR y garantizar el anonimato de los pacientes.',
  ),
  block(
    'tasks',
    'Lista de tareas',
    '- [x] Implementar encriptación end-to-end\n- [x] Establecer protocolos de consentimiento informado\n- [ ] Desarrollar estándares internacionales de interoperabilidad\n- [ ] Crear marcos regulatorios específicos para IA médica',
  ),
  block(
    'h3-sesgo',
    'Subsección H3 — Sesgo algorítmico',
    '### Sesgo Algorítmico',
  ),
  block(
    'p-sesgo',
    'Párrafo — Sesgo algorítmico',
    'Los modelos de IA pueden perpetuar sesgos existentes en los datos de entrenamiento. Es crucial usar `conjuntos de datos diversos` y realizar auditorías regulares para garantizar equidad en el tratamiento.',
  ),
  block(
    'code',
    'Bloque de código',
    '```python\n# Ejemplo de validación de equidad en modelo médico\ndef evaluar_sesgo(modelo, datos_demograficos):\n    resultados = {}\n    for grupo in datos_demograficos:\n        precision = modelo.evaluate(grupo)\n        resultados[grupo.nombre] = precision\n    return resultados\n```',
  ),
  block(
    'h2-futuro',
    'Sección H2 — Futuro',
    '## El Futuro de la IA en Medicina',
  ),
  block(
    'p-futuro',
    'Párrafo — Futuro',
    'Las proyecciones indican que para 2030, el mercado global de IA en salud alcanzará los 188 mil millones de dólares. Las áreas más prometedoras incluyen:',
  ),
  block(
    'table',
    'Tabla',
    '| Área de Aplicación | Impacto Esperado | Inversión 2024 |\n| --- | --- | --- |\n| Diagnóstico por imagen | Alto | $15.4B |\n| Descubrimiento de fármacos | Muy alto | $12.8B |\n| Asistentes virtuales | Medio | $8.2B |\n| Cirugía robótica | Alto | $10.1B |',
  ),
  block(
    'h3-iot',
    'Subsección H3 — IoT médico',
    '### Integración con IoT Médico',
  ),
  block(
    'p-iot',
    'Párrafo — IoT (con enlace)',
    'Los dispositivos portables (wearables) conectados a sistemas de IA permitirán monitoreo continuo de signos vitales y alertas tempranas de problemas de salud. Imagina un futuro donde tu [smartwatch](https://example.com) detecta arritmias cardíacas antes de que sientas síntomas.',
  ),
  block(
    'h2-conclusion',
    'Sección H2 — Conclusión',
    '## Conclusión',
  ),
  block(
    'p-conclusion',
    'Párrafo — Conclusión',
    'La inteligencia artificial no reemplazará a los médicos, pero los médicos que usen IA reemplazarán a los que no lo hagan. La clave está en encontrar el equilibrio perfecto entre la capacidad analítica de las máquinas y la empatía y juicio clínico humano.',
  ),
  block('hr', 'Separador', '---'),
  block(
    'p-cierre',
    'Párrafo — Código inline',
    'Para más información sobre implementaciones específicas, consulta el repositorio de código abierto `medical-ai-toolkit` disponible en GitHub.',
  ),
];

export function cloneDefaultBlocks(): MarkdownBlock[] {
  return DEFAULT_BLOCKS.map((b) => ({ ...b }));
}

export function findDefaultBlock(id: string): MarkdownBlock | undefined {
  return DEFAULT_BLOCKS.find((b) => b.id === id);
}

/** Maps section id to style control group id for sidebar highlight */
export const SECTION_STYLE_GROUP: Record<string, string> = {
  title: 'h1',
  intro: 'paragraph',
  'h2-diagnostico': 'h2',
  'p-diagnostico': 'paragraph',
  'h3-cancer': 'h3',
  'p-cancer': 'paragraph',
  'ul-cancer': 'lists',
  'h3-cardiaco': 'h3',
  'p-cardiaco': 'paragraph',
  'h2-personalizada': 'h2',
  'p-personalizada': 'paragraph',
  blockquote: 'blockquote',
  'h3-farmacogenomica': 'h3',
  'p-farmacogenomica': 'paragraph',
  'ol-farmacogenomica': 'lists',
  'h2-eticos': 'h2',
  'p-eticos': 'paragraph',
  'h3-privacidad': 'h3',
  'p-privacidad': 'paragraph',
  tasks: 'task-list',
  'h3-sesgo': 'h3',
  'p-sesgo': 'paragraph',
  code: 'code-block',
  'h2-futuro': 'h2',
  'p-futuro': 'paragraph',
  table: 'table',
  'h3-iot': 'h3',
  'p-iot': 'links',
  'h2-conclusion': 'h2',
  'p-conclusion': 'paragraph',
  hr: 'hr-image',
  'p-cierre': 'inline-code',
};
