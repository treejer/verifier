import { useCallback } from 'react'
import { put, takeLatest, select } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { useDispatch, useSelector } from 'react-redux'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('requestDetail')

export function* watchRequestDetail(action) {
  console.log('actionnnn', action)
  const { param: id, action: actionType } = action.payload
  const { base_url } = yield select((state) => state.web3?.config || {})
  const { access_token } = yield select((state) => state.userSign?.data || {})
  try {
    const response = yield apiPlugin.getData(`${base_url}/${actionType}_requests/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    })
    yield put(actions.loadSuccess(response))
  } catch (e) {
    yield put(actions.loadFailure(e))
  }
}

export function* requestDetailSagas() {
  yield takeLatest(actionTypes.load, watchRequestDetail)
}

export function useGetRequestDetail() {
  const dispatch = useDispatch()
  const { data: requestDetailData, ...requestDetail } = useSelector((state) => state.requestDetail)
  const dispatchGetRequestDetail = useCallback(
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

  return {
    requestDetailData,
    ...requestDetail,
    dispatchGetRequestDetail,
  }
}

export {
  reducer as requestDetailReducer,
  actions as requestDetailActions,
  actionTypes as requestDetailActionTypes,
}
