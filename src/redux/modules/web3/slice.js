import { useSelector } from 'react-redux'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  config: null,
  isSupportedNetwork: false,
}

const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    watchAppNetwrok: (state, action) => {
      state.config = action.payload
    },
    setIsSupportedNetwork: (state, action) => {
      state.isSupportedNetwork = action.payload
    },
  },
})

export function useWeb3() {
  const web3 = useSelector((state) => state.web3)
  return { web3 }
}

export const { watchAppNetwrok, setIsSupportedNetwork } = web3Slice.actions
export default web3Slice.reducer
