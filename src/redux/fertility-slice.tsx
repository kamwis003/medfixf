import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface ICycleEntryRedux {
  id: string
  startDate: string
  endDate?: string
  ovulationDate?: string
  symptoms: {
    type: string
    intensity: number
    description?: string
  }[]
  notes?: string
}

interface IFertilityState {
  entries: ICycleEntryRedux[]
}

const STORAGE_KEY = 'fertility_cycles'

export { STORAGE_KEY as FERTILITY_STORAGE_KEY }

function loadFromStorage(): ICycleEntryRedux[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ICycleEntryRedux[]
  } catch {
    // ignore
  }
  return []
}

function sortByDate(entries: ICycleEntryRedux[]): ICycleEntryRedux[] {
  return [...entries].sort((a, b) => a.startDate.localeCompare(b.startDate))
}

const initialState: IFertilityState = {
  entries: loadFromStorage(),
}

const fertilitySlice = createSlice({
  name: 'fertility',
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<ICycleEntryRedux>) => {
      state.entries = sortByDate([...state.entries, action.payload])
    },
    updateEntry: (state, action: PayloadAction<ICycleEntryRedux>) => {
      const index = state.entries.findIndex(e => e.id === action.payload.id)
      if (index !== -1) {
        state.entries[index] = action.payload
        state.entries = sortByDate(state.entries)
      }
    },
    deleteEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(e => e.id !== action.payload)
    },
    setOvulationDate: (state, action: PayloadAction<{ entryId: string; date?: string }>) => {
      const entry = state.entries.find(e => e.id === action.payload.entryId)
      if (entry) {
        entry.ovulationDate = action.payload.date
      }
    },
  },
})

export const { addEntry, updateEntry, deleteEntry, setOvulationDate } = fertilitySlice.actions

export const selectFertilityEntries = (state: { fertility: IFertilityState }) =>
  state.fertility.entries

export default fertilitySlice.reducer
