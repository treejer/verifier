import { useCallback } from 'react'
<<<<<<< HEAD
import { put, takeLatest, select, call } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { setPatchData, setPatchError } from '../userPatch'
=======
import { put, takeEvery, select } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
>>>>>>> dev
import { useDispatch, useSelector } from 'react-redux'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('userDetail')

<<<<<<< HEAD
const PATCH_STATUS = 'PATCH_STATUS'
const PATCH_USER = 'PATCH_USER'
const LOAD_USER_DETAIL = 'userDetail/LOAD'

function patchUserStatus(payload) {
  return { type: PATCH_STATUS, payload }
}

function patchUserInfo(payload) {
  return { type: PATCH_USER, payload }
}

=======
>>>>>>> dev
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
  } catch (e) {
    yield put(actions.loadFailure(e))
    // yield put(resetPatchState())
  }
}

export function* userDetailSagas() {
  yield takeEvery(actionTypes.load, watchUserDetail)
}

export function useGetUserDetail() {
  const dispatch = useDispatch()
  const { data: userDetailData, ...userDetail } = useSelector((state) => state.userDetail)
  const dispatchGetUserDetail = useCallback(
    (action) => {
      const id = action
      dispatch(actions.load(id))
    },
    [dispatch],
  )

  return {
    userDetailData,
    ...userDetail,
    dispatchGetUserDetail,
  }
}

export {
  reducer as userDetailReducer,
  actions as userDetailActions,
  actionTypes as userDetailActionTypes,
}
