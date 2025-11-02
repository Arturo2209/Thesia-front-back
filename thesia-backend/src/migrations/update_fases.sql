-- Primero, modificamos el ENUM para incluir los nuevos valores
ALTER TABLE documento 
  MODIFY COLUMN fase ENUM(
    'fase_1_plan_proyecto',
    'fase_2_diagnostico',
    'fase_3_marco_teorico',
    'fase_4_desarrollo',
    'fase_5_resultados',
    'propuesta',
    'avance1',
    'avance2',
    'final'
  ) NOT NULL;

-- Luego, actualizamos los valores existentes
UPDATE documento SET fase = 'fase_1_plan_proyecto' WHERE fase = 'propuesta';
UPDATE documento SET fase = 'fase_2_diagnostico' WHERE fase = 'avance1';
UPDATE documento SET fase = 'fase_3_marco_teorico' WHERE fase = 'avance2';
UPDATE documento SET fase = 'fase_4_desarrollo' WHERE fase = 'final';

-- Finalmente, modificamos el ENUM para quitar los valores antiguos
ALTER TABLE documento 
  MODIFY COLUMN fase ENUM(
    'fase_1_plan_proyecto',
    'fase_2_diagnostico',
    'fase_3_marco_teorico',
    'fase_4_desarrollo',
    'fase_5_resultados'
  ) NOT NULL;