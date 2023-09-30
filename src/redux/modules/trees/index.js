import { useCallback } from 'react'
import { put, takeEvery } from 'redux-saga/effects'
import ReduxFetchState from 'redux-fetch-state'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import apiPlugin from '../../../services/api'

const { actions, actionTypes, reducer } = new ReduxFetchState('Trees')

export function* watchTrees(action) {
  const param = action.payload

  function hexToDec(hexString) {
    return parseInt(hexString, 16)
  }

  function decToHex(decimalNumber) {
    const b = Number(decimalNumber)
    if (decimalNumber) {
      return ethers.utils.hexlify(b)
    }
  }

  let whereQuery = ''
  if (param.query.planter) {
    whereQuery += `, planter: "${param.query.planter.toLowerCase()}"`
  }
  if (param.query.id) {
    whereQuery += `, id: ${decToHex(param.query.id)}`
  }
  try {
    const response = yield apiPlugin.postData(`${process.env.REACT_APP_GRAPHQL_URL}`, {
      query: `{
        trees(
          first: ${param.currentPage * param.limit},
          skip: ${param.skip},
          orderBy: createdAt,
          orderDirection: desc,
          ${whereQuery ? `where: ${whereQuery}` : ''}
    ) {
      id
      planter {
        id
      }
    plantDate
          treeSpecsEntity {
      latitude
      longitude
      nursery
      locations
    }
          lastUpdate {
      updateStatus
      updateSpecs
      createdAt
    }
    createdAt
    updatedAt
  }
      }
`,
    })
    let items = []
    response.data.trees.map((item, index) => {
      const treeId = hexToDec(item.id)
      items.push({
        Number: index + 1,
        id: treeId,
        prevId: item.id,
        Planter: item.planter
          ? item.planter.id.slice(0, 5) + '...' + item.planter.id.slice(-5)
          : null,
        TreeSpecsEntity:
          item.treeSpecsEntity && item.treeSpecsEntity.latitude
            ? item.treeSpecsEntity.latitude + ',' + item.treeSpecsEntity.longitude
            : 'Empty',
        LastUpdateAt: item.lastUpdate,
        CreatedAt: item.createdAt * 1000,
        showDetail: treeId,
      })
    })
    yield put(actions.loadSuccess(items))
  } catch (e) {
    yield put(actions.loadFailure(e))
  }
}

export function* treesSagas() {
  yield takeEvery(actionTypes.load, watchTrees)
}

export function useGetTrees() {
  const dispatch = useDispatch()
  const { data: treesData, loading: treeLoading } = useSelector((state) => state.trees)
  const dispatchGetTrees = useCallback(
    (action) => {
      const param = action
      dispatch(actions.load(param))
    },
    [dispatch],
  )
  return { treesData, treeLoading, dispatchGetTrees }
}

export { reducer as treesReducer, actions as treesActions, actionTypes as treesActionTypes }
