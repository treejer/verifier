import { useCallback } from 'react'
import { put, takeEvery, select } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { useDispatch, useSelector } from 'react-redux'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('Users')

export function* watchUsers(action) {
  const param = action.payload
  const { base_url } = yield select((state) => state.web3?.config || {})
  const { access_token } = yield select((state) => state.userSign?.data || {})
  const queryFilter = encodeURIComponent(JSON.stringify(param.filters))
  const querySort = encodeURIComponent(JSON.stringify(param.sort))
  try {
    const response = yield apiPlugin.getData(
      `${base_url}/admin/users/paginate?filters=${queryFilter}&sort=${querySort}`,
      {
        params: {
          skip: param.skip,
          limit: param.limit,
        },
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

export function* usersSagas() {
  yield takeEvery(actionTypes.load, watchUsers)
}

export function useGetUsers() {
  const dispatch = useDispatch()
  const { data: usersData, loading: userLoading } = useSelector((state) => state.users)
  const dispatchGetUsers = useCallback(
    (action) => {
      const param = action
      dispatch(actions.load(param))
    },
    [dispatch],
  )
  return { usersData, userLoading, dispatchGetUsers }
}

export { reducer as UsersReducer, actions as UsersActions, actionTypes as UsersActionTypes }
