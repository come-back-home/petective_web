import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../_reducers'
import requestMiddleware from './requestMiddleware'
import { config } from '../config'

const loggerMiddleware = createLogger()
export const store = createStore(
  rootReducer,
  config.debug ? applyMiddleware(
    requestMiddleware(),
    thunkMiddleware,
    loggerMiddleware,
  ) : applyMiddleware(
    requestMiddleware(),
    thunkMiddleware
  )
)
