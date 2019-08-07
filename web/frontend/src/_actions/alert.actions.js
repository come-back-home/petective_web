import { alertConstants } from '../_constants'

function success(message) {
  return { type: alertConstants.SUCCESS, message }
}

function error(message) {
  return { type: alertConstants.ERROR, message }
}

function clear() {
  return { type: alertConstants.CLEAR }
}

function warning(message) {
  return { type: alertConstants.WARNING, message }
}

export const alertActions = {
  success,
  error,
  clear,
  warning
}
