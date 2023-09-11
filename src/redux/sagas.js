import { all } from 'redux-saga/effects'
import { userNonceSagas } from './modules/userNonce'
import { usersSagas } from './modules/users'
import { userDetailSagas } from './modules/userDetail'
import { userPatchSagas } from './modules/userPatch'
import { userSignSagas } from './modules/userSign'
import { treeDetailSagas } from './modules/treeDetail'
import { veirfyListSagas } from './modules/verifyList'
import { plantersSagas } from './modules/planters'
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
    userPatchSagas(),
    veirfyListSagas(),
    treeDetailSagas(),
    plantersSagas(),
  ])
}
