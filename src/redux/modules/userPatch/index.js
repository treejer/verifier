import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
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

  const dispatch = useDispatch()
  const dispatchReset = useCallback(() => {
    console.log('inja call mishe')
    dispatch(resetPatchState())
  }, [dispatch])

  return { patchData, dispatchReset }
}

export const { setPatchData, setPatchError, resetPatchState } = patchSlice.actions
export default patchSlice.reducer
