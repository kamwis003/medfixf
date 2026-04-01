export interface CycleEntry {
  id: string
  userId: string
  startDate: Date
  endDate?: Date
  symptoms: Symptom[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type SymptomType = 'cramps' | 'headache' | 'mood_changes' | 'fatigue' | 'bloating' | 'breast_tenderness' | 'other'

export interface Symptom {
  type: SymptomType
  intensity: 1 | 2 | 3 | 4 | 5
  description?: string
}

export type SpecialistType = 'gynecologist' | 'fertility_specialist' | 'endocrinologist'

export interface ConsultationRequest {
  id: string
  userId: string
  specialistType: SpecialistType
  description?: string
  createdAt: Date
  status: 'pending' | 'confirmed' | 'completed'
}

export interface CycleStats {
  averageLength: number
  lastCycles: {
    startDate: Date
    length: number
  }[]
}