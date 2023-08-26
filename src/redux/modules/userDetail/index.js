import { useCallback } from 'react'
import { put, takeLatest, select, call } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { setPatchData, setPatchError, resetPatchState } from '../userPatch'
import { useDispatch, useSelector } from 'react-redux'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('userDetail')

const PATCH_STATUS = 'PATCH_STATUS'
const PATCH_USER = 'PATCH_USER'
const LOAD_USER_DETAIL = 'userDetail/LOAD'

function patchUserStatus(payload) {
  return { type: PATCH_STATUS, payload }
}

function patchUserInfo(payload) {
  return { type: PATCH_USER, payload }
}

export function* watchUserDetail(action) {
  const param = action.payload
  const { base_url } = yield select((state) => state.web3?.config || {})
  const { access_token } = yield select((state) => state.userSign?.data || {})
  try {
    const response = yield apiPlugin.getData(`${base_url}/admin/users/${param}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    })
    if (response.file) {
      const fileUrl = `${base_url}/files/${response.file.filename}`
      const headers = {
        accept: 'application/json',
        'x-auth-userid': response.user._id,
        'x-auth-logintoken': access_token,
        Authorization: `Bearer ${access_token}`,
      }
      try {
        yield apiPlugin.getData(fileUrl, {
          headers,
          responseType: 'blob',
        })
      } catch (error) {
        console.error('Error fetching file:', error)
      }
    }
    yield put(actions.loadSuccess(response))
    yield put(resetPatchState())
  } catch (e) {
    yield put(actions.loadFailure(e))
    yield put(resetPatchState())
  }
}

function* patchUserDetail(action) {
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
    yield put(setPatchData(response))
  } catch (error) {
    yield put(setPatchError(error))
  }
}

function* handleUserAction(action) {
  switch (action.type) {
    case PATCH_STATUS:
      yield call(patchUserDetail, action)
      break
    case LOAD_USER_DETAIL:
      yield call(watchUserDetail, action)
      break
    default:
      break
  }
}

export function* userDetailSagas() {
  yield takeLatest([actionTypes.load, PATCH_STATUS, PATCH_USER], handleUserAction)
}

export function useGetUserDetail() {
  const dispatch = useDispatch()
  const { data: userDetailData, loading: userDetailLoading } = useSelector(
    (state) => state.userDetail,
  )
  const dispatchGetUserDetail = useCallback(
    (action) => {
      const id = action
      dispatch(actions.load(id))
    },
    [dispatch],
  )

  const dispatchPatchUser = useCallback(
    (id, action) => {
      dispatch(patchUserStatus({ id: id, action: action }))
    },
    [dispatch],
  )

  const dispatchPatchUserInfo = useCallback(
    (id, action) => {
      dispatch(patchUserInfo({ id: id, action: action }))
    },
    [dispatch],
  )

  return {
    userDetailData,
    userDetailLoading,
    dispatchPatchUser,
    dispatchPatchUserInfo,
    dispatchGetUserDetail,
  }
}

export {
  reducer as userDetailReducer,
  actions as userDetailActions,
  actionTypes as userDetailActionTypes,
  patchUserStatus,
  patchUserInfo,
}
