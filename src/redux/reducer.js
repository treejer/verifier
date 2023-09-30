import { combineReducers } from 'redux'
import initReducer from './modules/init/slice'
import web3Reducer from './modules/web3/slice'
import { userPatchReducer } from './modules/userPatch'
import { userSignReducer } from './modules/userSign'
import { userNonceReducer } from './modules/userNonce'
import { UsersReducer } from './modules/users'
import { userDetailReducer } from './modules/userDetail'
import { PlantersReducer } from './modules/requests'
import { requestDetailReducer } from './modules/requestDetail'
import { requestRejectReducer } from './modules/requestReject'
import { listReducer } from './modules/verifyList'
import { treesReducer } from './modules/trees'
import { treeDetailReducer } from './modules/treeDetail'

const rootReducer = combineReducers({
  init: initReducer,
  userSign: userSignReducer,
  userNonce: userNonceReducer,
  web3: web3Reducer,
  userPatch: userPatchReducer,
  users: UsersReducer,
  userDetail: userDetailReducer,
  verifyList: listReducer,
  planters: PlantersReducer,
  requestDetail: requestDetailReducer,
  trees: treesReducer,
  treeDetail: treeDetailReducer,
  requestReject: requestRejectReducer,
})

export default rootReducer
