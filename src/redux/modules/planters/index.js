import { useCallback } from 'react'
import { put, takeEvery, select } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { useDispatch, useSelector } from 'react-redux'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('Planter')

export function* watchPlanters(action) {
  const { param, action: actionType } = action.payload
  const { base_url } = yield select((state) => state.web3?.config || {})
  const { access_token } = yield select((state) => state.userSign?.data || {})
  try {
    const response = yield apiPlugin.getData(`${base_url}/${actionType}_requests`, {
      params: param,
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

export function* plantersSagas() {
  yield takeEvery(actionTypes.load, watchPlanters)
}

export function useGetPlanters() {
  const dispatch = useDispatch()
  const { data: plantersData, ...Planter } = useSelector((state) => state.planters)
  const dispatchGetPlanters = useCallback(
    (action, param) => {
      dispatch(actions.load({ action, param }))
    },
    [dispatch],
  )
  return { plantersData, ...Planter, dispatchGetPlanters }
}

export {
  reducer as PlantersReducer,
  actions as PlantersActions,
  actionTypes as PlantersActionTypes,
}
