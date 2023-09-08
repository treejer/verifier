import { useCallback } from 'react'
import { put, takeEvery, select } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { useDispatch, useSelector } from 'react-redux'

const { actions, actionTypes, reducer } = new ReduxFetchState('verifyList')

export function* watchBasket(action) {
  const { action: actionType, param } = action.payload
  const { data: listData } = yield select((state) => state.verifyList)
  try {
    if (actionType === 'addToList') {
      if (listData && listData.length > 0 && param) {
        const duplicate = listData.find((item) => item.request._id === param.request._id)
        if (!duplicate) {
          yield put(actions.loadSuccess([param, ...listData]))
        } else {
          yield put(actions.loadFailure())
        }
      } else {
        yield put(actions.loadSuccess([param]))
      }
    } else if (actionType === 'removeFromList') {
      const filteredItems = listData.filter((item) => item.request?._id !== param.request?._id)
      yield put(actions.loadSuccess(filteredItems))
    }
  } catch (e) {
    yield put(actions.loadFailure(e))
  }
}

export function* basketSagas() {
  yield takeEvery(actionTypes.load, watchBasket)
}

export function useGetVerifyList() {
  const dispatch = useDispatch()
  const { data: listData, ...verifyList } = useSelector((state) => state.verifyList)
  const dispatchActionList = useCallback(
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

  const existInList = useCallback(
    (id) => {
      if (listData && listData.length > 0) {
        const duplicate = listData.find((item) => item.request._id === id)
        return duplicate ? true : false
      } else {
        return false
      }
    },
    [dispatch],
  )
  return { listData, ...verifyList, dispatchActionList, existInList }
}

export { reducer as basketReducer, actions as basketActions, actionTypes as basketActionTypes }
