import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducer'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['init', 'userSign', 'userNonce', 'web3', 'verifyList'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).prepend(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

const persistor = persistStore(store)

export { store, persistor }
