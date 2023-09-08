import { useCallback } from 'react'
import { put, takeLatest, select } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { useDispatch, useSelector } from 'react-redux'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('treeDetail')

export function* watchTreeDetail(action) {
  const { param: id, type: apiMethod, action: actionType } = action.payload
  const { base_url } = yield select((state) => state.web3?.config || {})
  const { access_token } = yield select((state) => state.userSign?.data || {})
  try {
    const response = yield apiPlugin[apiMethod](`${base_url}/${actionType}_requests/${id}`, {
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

export function* treeDetailSagas() {
  yield takeLatest(actionTypes.load, watchTreeDetail)
}

export function useGetTreeDetail() {
  const dispatch = useDispatch()
  const { data: treeDetailData, ...treeDetail } = useSelector((state) => state.treeDetail)
  const dispatchGetTreeDetail = useCallback(
    (type, action, param) => {
      if (action === 'reset') {
        dispatch(actions.resetCache())
        return
      } else {
        dispatch(actions.load({ type, action, param }))
      }
    },
    [dispatch],
  )
  return { treeDetailData, ...treeDetail, dispatchGetTreeDetail }
}

export {
  reducer as treeDetailReducer,
  actions as treeDetailActions,
  actionTypes as treeDetailActionTypes,
}
