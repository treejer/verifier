import { combineReducers } from 'redux'
import initReducer from './modules/init/slice'
import web3Reducer from './modules/web3/slice'
import { userPatchReducer } from './modules/userPatch'
import { userSignReducer } from './modules/userSign'
import { userNonceReducer } from './modules/userNonce'
import { UsersReducer } from './modules/users'
import { userDetailReducer } from './modules/userDetail'
import { PlantersReducer } from './modules/planters'
import { treeDetailReducer } from './modules/treeDetail'
import { basketReducer } from './modules/verifyList'

const rootReducer = combineReducers({
  init: initReducer,
  userSign: userSignReducer,
  userNonce: userNonceReducer,
  web3: web3Reducer,
  userPatch: userPatchReducer,
  users: UsersReducer,
  userDetail: userDetailReducer,
  verifyList: basketReducer,
  planters: PlantersReducer,
  treeDetail: treeDetailReducer,
})

export default rootReducer
