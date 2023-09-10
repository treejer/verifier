import { put, takeEvery, select } from 'redux-saga/effects'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import ReduxFetchState from 'redux-fetch-state'
import apiPlugin from '../../../services/api'
const { actions, actionTypes, reducer } = new ReduxFetchState('userSign')

export function* watchUserSign(action) {
  const { base_url } = yield select((state) => state.web3.config)
  const { address, signature } = action.payload
  try {
    const response = yield apiPlugin.postData(`${base_url}/login/${address}`, {
      signature: signature,
    })
    yield put(actions.loadSuccess({ ...response, address: address }))
  } catch (e) {
    yield put(actions.loadFailure(e))
  }
}

export function* userSignSagas() {
  yield takeEvery(actionTypes.load, watchUserSign)
}

export function useUserSign() {
  const dispatch = useDispatch()
  const { data: userSign, ...userSignState } = useSelector((state) => state.userSign)

  const dispatchRemoveToken = useCallback(() => {
    dispatch(actions.loadSuccess([]))
  }, [dispatch])

  return { userSign, ...userSignState, dispatchRemoveToken }
}

export {
  reducer as userSignReducer,
  actions as userSignActions,
  actionTypes as userSignActionTypes,
}
