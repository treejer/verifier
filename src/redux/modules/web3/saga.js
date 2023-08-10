import { takeEvery, call, put } from 'redux-saga/effects'
import { watchNetwork } from '@wagmi/core'
import { setIsSupportedNetwork, watchAppNetwrok } from './slice'
import blockChainConfig from '../../../services/config'

function* handleNetworkChange({ chain }) {
  try {
    const chainConfig = blockChainConfig[chain?.id]
    if (chainConfig) {
      yield put(setIsSupportedNetwork(true))
      yield put(watchAppNetwrok(chainConfig))
    } else {
      yield put(setIsSupportedNetwork(false))
    }
  } catch (error) {
    console.error('Error while handling network change:', error)
  }
}

function watchNetworkPromise() {
  return new Promise((resolve, reject) => {
    watchNetwork(({ chain }) => {
      if (chain && !chain.unsupported) {
        resolve({ chain })
      }
    })
  })
}

export function* watchCurrentNetwork() {
  try {
    const { chain } = yield call(watchNetworkPromise)
    yield call(handleNetworkChange, { chain })
  } catch (error) {
    console.error('Error while watching network:', error)
  }
}

export function* web3Saga() {
  yield takeEvery(watchAppNetwrok.type, watchCurrentNetwork)
}
