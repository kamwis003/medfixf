export interface IPatientProfile {
  id: string
  firstName: string
  lastName: string
  createdAt: string
}

export interface IPatientDiaryEntry {
  id: string
  userId: string
  date: string
  painLevel: number
  painLocation: string
  symptoms: string
  hadSurgeryLast6Months: boolean
  surgeryDescription?: string
  hormonalTreatment: boolean
  recentImaging: boolean
  cycleDay?: number
  createdAt: string
}

export interface IPatientPrediction {
  id: string
  patientId: string
  createdAt: string
  endometriosisRisk: number
  stageEstimate?: string
  notes?: string
}

export type TListPatientsResponse = {
  success: true
  data: IPatientProfile[]
}

export type TGetPatientResponse = {
  success: true
  data: IPatientProfile
}

export type TListPatientDiaryResponse = {
  success: true
  data: IPatientDiaryEntry[]
}

export type TListPatientPredictionsResponse = {
  success: true
  data: IPatientPrediction[]
}
