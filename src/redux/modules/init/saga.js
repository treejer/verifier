import { put, take, takeEvery } from 'redux-saga/effects'
import { watchAppNetwrok } from '../web3/slice'
import { initApp, initAppCompleted } from './slice'
export function* watchInitApp() {
  try {
    yield put(watchAppNetwrok())
    yield take(watchAppNetwrok)
    yield put(initAppCompleted())
  } catch (e) {
    console.log(e, 'error in init app')
  }
}

export function* initSagas() {
  yield takeEvery(initApp, watchInitApp)
}
