import { userConstants } from '../_constants'

const initialState = {}

export function resetPassword(state = initialState, action) {
  switch (action.type) {
  case userConstants.RESET_PASSWORD_REQUEST:
    return {
      resettingIn: true,
      user: action.user
    }
  case userConstants.RESET_PASSWORD_SUCCESS:
    return {
      resettedIn: true,
      user: action.user
    }
  case userConstants.RESET_PASSWORD_FAILURE:
    return {}
  case userConstants.LOGOUT:
    return {}
  default:
    return state
  }
}
