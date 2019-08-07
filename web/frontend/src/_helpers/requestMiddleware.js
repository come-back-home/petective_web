import { userActions, alertActions } from '../_actions'
import { jwtDecode } from './jwt'

export default function requestMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }
    const {
      promise, types, ...rest
    } = action
    if (!promise) {
      return next(action)
    }
    const [REQUEST, SUCCESS, FAILURE] = types
    next({ ...rest, type: REQUEST })

    let actionPromise = Promise.resolve()
    const { token, refresh } = (getState().authentication.user || {})
    if (!token) {
      if (!refresh) {
        return next({ ...rest, type: FAILURE })
      }
      actionPromise = next(userActions.refresh())
        .then(() => promise(rest))
    } else {
      const decodedToken = jwtDecode(token)
      const refreshThreshold = (new Date().getTime() / 1000 | 0 + 300)

      if (refresh && refreshThreshold > decodedToken.payload.exp) {
        actionPromise = next(userActions.refresh())
          .then(() => promise(rest))
      } else {
        actionPromise = promise(rest)
      }
    }
    actionPromise
      .then(
        result => next({ ...rest, result, type: SUCCESS }),
        error => {
          next(alertActions.error(error))
          return next({ ...rest, error, type: FAILURE })
        }
      )
      .catch((error) => {
        console.error('MIDDLEWARE ERROR:', error)
        next({ ...rest, error, type: FAILURE })
      })
    return actionPromise
  }
}
