import { createSlice } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'

const initialState = {
  sidebarShow: true,
}

const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    setSidebarShow: (state) => {
      state.sidebarShow = !state.sidebarShow
    },
    initApp: (state) => {
      state.loading = true
    },
    initAppCompleted: (state) => {
      state.loading = false
    },
  },
})

export function useToggleSidebar() {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.init.sidebarShow)

  const toggleSidebar = useCallback(() => {
    dispatch(initSlice.actions.setSidebarShow())
  }, [dispatch])

  return { sidebarShow, toggleSidebar }
}

export function useInit() {
  const initState = useSelector((state) => state.init)
  const dispatch = useDispatch()

  const dispatchInit = useCallback(() => {
    dispatch(initApp())
  }, [dispatch])

  const dispatchInitCompleted = useCallback(() => {
    dispatch(initAppCompleted())
  }, [dispatch])

  return {
    initState,
    dispatchInit,
    dispatchInitCompleted,
  }
}

export const { setSidebarShow, initApp, initAppCompleted } = initSlice.actions
export default initSlice.reducer
