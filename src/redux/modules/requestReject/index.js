import { useCallback } from 'react'
import { put, takeLatest, select } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { useDispatch, useSelector } from 'react-redux'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('requestReject')

export function* watchRequestReject(action) {
  const { param: id, action: actionType } = action.payload
  const { base_url } = yield select((state) => state.web3?.config || {})
  const { access_token } = yield select((state) => state.userSign?.data || {})
  try {
    const response = yield apiPlugin.patchData(
      `${base_url}/${actionType}_requests/reject`,
      { id: id },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    )
    yield put(actions.loadSuccess(response))
  } catch (e) {
    yield put(actions.loadFailure(e))
  }
}

export function* requestRejectSagas() {
  yield takeLatest(actionTypes.load, watchRequestReject)
}

export function useGetRequestReject() {
  const dispatch = useDispatch()
  const { data: requestRejectData, ...requestReject } = useSelector((state) => state.requestReject)
  const dispatchGetRequestReject = useCallback(
    (action, param) => {
      if (action === 'reset') {
        dispatch(actions.resetCache())
        return
      } else {
        dispatch(actions.load({ action, param }))
      }
    },
    [dispatch],
  )
  return { requestRejectData, ...requestReject, dispatchGetRequestReject }
}

export {
  reducer as requestRejectReducer,
  actions as requestRejectActions,
  actionTypes as requestRejectActionTypes,
}
