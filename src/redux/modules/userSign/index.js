import { put, takeEvery } from 'redux-saga/effects'
import { useCallback } from 'react'
import ReduxFetchState from 'redux-fetch-state'
import apiPlugin from '../../../services/api'
import { useDispatch } from 'react-redux'
const API_URL = process.env.REACT_APP_BASE_URL

const { actions, actionTypes, reducer } = new ReduxFetchState('userSign')

export function* watchUserSign(action) {
  const { address, signature } = action.payload
  try {
    const response = yield apiPlugin.postData(`${API_URL}/login/${address}`, {
      signature: signature,
    })
    yield put(actions.loadSuccess(response))
  } catch (e) {
    yield put(actions.loadFailure(e))
  }
}

export function* userSignSagas() {
  yield takeEvery(actionTypes.load, watchUserSign)
}

export function useRemoveToken() {
  const dispatch = useDispatch()

  const dispatchRemoveToken = useCallback(() => {
    dispatch(actions.loadSuccess([]))
  }, [dispatch])

  return { dispatchRemoveToken }
}

export {
  reducer as userSignReducer,
  actions as userSignActions,
  actionTypes as userSignActionTypes,
}
