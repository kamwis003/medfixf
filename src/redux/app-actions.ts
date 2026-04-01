import { createAction } from '@reduxjs/toolkit'

/**
 * * Clears all Redux state back to initial values.
 * * Use this on logout / session invalidation to avoid leaking user data
 * * (courses, exams, users, etc.) across auth sessions.
 */
export const resetApp = createAction('app/reset')
