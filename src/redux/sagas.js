import { all } from 'redux-saga/effects'
import { userNonceSagas } from './modules/userNonce'
import { usersSagas } from './modules/users'
import { plantersSagas } from './modules/planters'
import { userDetailSagas } from './modules/userDetail'
import { userSignSagas } from './modules/userSign'
import { initSagas } from './modules/init/saga'
import { web3Saga } from './modules/web3/saga'

export default function* rootSaga() {
  yield all([
    initSagas(),
    userNonceSagas(),
    userSignSagas(),
    web3Saga(),
    usersSagas(),
    userDetailSagas(),
    plantersSagas(),
  ])
}
