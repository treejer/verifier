import { useCallback } from 'react'
import { put, takeEvery, select } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { useDispatch, useSelector } from 'react-redux'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('userPatch')

export function* watchUserPatch(action) {
  const userId = action.payload.id
  const actionType = action.payload.action
  const { base_url } = yield select((state) => state.web3?.config || {})
  const { access_token } = yield select((state) => state.userSign?.data || {})
  const data = { userId: userId }
  try {
    const response = yield apiPlugin.patchData(`${base_url}/admin/${actionType}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    })
    yield put(actions.loadSuccess(response))
  } catch (error) {
    yield put(actions.loadFailure(error))
  }
}

export function* userPatchSagas() {
  yield takeEvery(actionTypes.load, watchUserPatch)
}

export function useGetPatch() {
  const dispatch = useDispatch()
  const { data: userPatchData, ...userPatch } = useSelector((state) => state.userPatch)
  const dispatchGetPatch = useCallback(
    (id, action) => {
      if (action === 'reset') {
        dispatch(actions.resetCache())
      } else {
        dispatch(actions.load({ action, id }))
      }
    },
    [dispatch],
  )
  return { userPatch, ...userPatch, dispatchGetPatch }
}

export {
  reducer as userPatchReducer,
  actions as userPatchActions,
  actionTypes as userPatchActionTypes,
}
