export type DiaryEntry = {
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

export type DiaryEntryForm = {
  date: string
  painLevel: number
  painLocation: string
  symptoms: string
  hadSurgeryLast6Months: boolean
  surgeryDescription: string
  hormonalTreatment: boolean
  recentImaging: boolean
  cycleDay: number | ''
}

export type DiaryEntryPoint = {
  date: string
  painLevel: number
}

export type ListDiaryResponse = {
  success: true
  data: DiaryEntry[]
}

export type CreateDiaryResponse = {
  success: true
  data: DiaryEntry
}
export type Article = {
  id: string
  userId: string
  title: string
  content: string
  createdAt: string
  author?: { id: string; name?: string } | null
}

export type ListArticleResponse = {
  success: true
  data: Article[]
}
