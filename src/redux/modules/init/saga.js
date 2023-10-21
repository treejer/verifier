import { put, call, takeEvery } from 'redux-saga/effects'
import { watchCurrentNetwork } from '../web3/saga'
import { initApp, initAppCompleted } from './slice'
export function* watchInitApp() {
  try {
    yield call(watchCurrentNetwork)
    yield put(initAppCompleted())
  } catch (e) {
    console.log(e, 'error in init app')
  }
}

export function* initSagas() {
  yield takeEvery(initApp, watchInitApp)
}
