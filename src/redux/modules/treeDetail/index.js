import { useCallback } from 'react'
import { put, takeLatest, se, takeLatestlect } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { useDispatch, useSelector } from 'react-redux'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('treeDetail')

export function* watchTrees(action) {
  const id = action.payload
  function decToHex(decimalNumber) {
    const id = parseInt(decimalNumber)
    return `0x${id.toString(16)}`
  }
  try {
    const response = yield apiPlugin.postData(`${process.env.REACT_APP_GRAPHQL_URL}`, {
      query: `{
        tree(id: "${decToHex(id)}"){
       id
       planter {
         id
       }
       funder {
         id
       }
       countryCode
        treeStatus
        plantDate
        birthDate
        treeSpecs
        createdAt
        updatedAt
       treeSpecsEntity{
         id
         name
         description
         externalUrl
         imageFs
         imageHash
         symbolFs
         symbolHash
         animationUrl
         diameter
         latitude
         longitude
         attributes
         updates
         nursery
         locations
       }
       lastUpdate {
         updateStatus
         updateSpecs
         updateSpecEntity {
           updates
           longitude
           latitude
           nursery
           locations
         }
         createdAt
       }
     }
   }`,
    })
    const data = response.data?.tree
    yield put(actions.loadSuccess(data))
  } catch (e) {
    yield put(actions.loadFailure(e))
  }
}

export function* treeDetailSagas() {
  yield takeLatest(actionTypes.load, watchTrees)
}

export function useGetTreeDetail() {
  const dispatch = useDispatch()
  const { data, loading: treeDetailLoading } = useSelector((state) => state.treeDetail)
  const dispatchGetTreeDetail = useCallback(
    async (action) => {
      const param = action
      await dispatch(actions.load(param))
    },
    [dispatch],
  )
  return { data, treeDetailLoading, dispatchGetTreeDetail }
}

export {
  reducer as treeDetailReducer,
  actions as treeDetailActions,
  actionTypes as treeDetailActionTypes,
}
