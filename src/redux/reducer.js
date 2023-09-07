import { combineReducers } from 'redux'
import initReducer from './modules/init/slice'
import web3Reducer from './modules/web3/slice'
import patchSlice from './modules/userPatch'
import { userSignReducer } from './modules/userSign'
import { userNonceReducer } from './modules/userNonce'
import { UsersReducer } from './modules/users'
import { PlantersReducer } from './modules/planters'
import { userDetailReducer } from './modules/userDetail'

const rootReducer = combineReducers({
  init: initReducer,
  userSign: userSignReducer,
  userNonce: userNonceReducer,
  web3: web3Reducer,
  patchSlice: patchSlice,
  users: UsersReducer,
  planters: PlantersReducer,
  userDetail: userDetailReducer,
})

export default rootReducer
