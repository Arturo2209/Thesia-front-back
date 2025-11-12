export interface AdvisorStudent {
  id: number;
  name: string;
  email: string;
  thesisTitle: string;
  specialty: string;
  // Fase elegida en el front (la principal que mostramos actualmente)
  phase: string;
  assignedDate: string;
  // Nuevos campos para diferenciar avance vs aprobada
  highestApprovedPhase?: string | null;
  highestSubmittedPhase?: string | null;
  thesisPhaseActual?: string | null;
  currentPhase?: string | null; // mayor fase enviada
  phaseLabel?: string; // representacion legible
}
