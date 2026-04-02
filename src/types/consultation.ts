import type { SpecialistType } from '@/types/fertility'

export type TConsultationStatus = 'pending' | 'accepted' | 'rejected'

export interface IConsultationRequest {
  id: string
  userId: string
  specialistType: SpecialistType
  doctorId?: string
  description?: string
  consentGiven: boolean
  status: TConsultationStatus
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface IClinicConsultationRequest extends IConsultationRequest {
  patient: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface ICreateConsultationRequest {
  specialistType: SpecialistType
  doctorId?: string
  description?: string
  consentGiven: boolean
}

export interface IUpdateConsultationStatus {
  status: 'accepted' | 'rejected'
  rejectionReason?: string
}

export interface IConsultationRequestsResponse {
  data: IConsultationRequest[]
}

export interface IClinicConsultationRequestsResponse {
  data: IClinicConsultationRequest[]
}
