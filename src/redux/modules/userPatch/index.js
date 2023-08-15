import { useSelector } from 'react-redux'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
  error: null,
}

const patchSlice = createSlice({
  name: 'patchSlice',
  initialState,
  reducers: {
    setPatchData: (state, action) => {
      state.data = action.payload
    },
    setPatchError: (state, action) => {
      state.error = action.payload
    },
    resetPatchState: (state) => {
      state.data = null
      state.error = null
    },
  },
})

export function usePatchData() {
  const patchData = useSelector((state) => state.patchSlice)

  return { patchData }
}

export const { setPatchData, setPatchError, resetPatchState } = patchSlice.actions
export default patchSlice.reducer
