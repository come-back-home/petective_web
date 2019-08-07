import { userConstants } from '../_constants'
import { userService } from '../_services'
import { alertActions } from './'
import { history } from '../_helpers'


function login(username, password) {
  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user }
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user }
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error }
  }
  return dispatch => {
    dispatch(request({ username }))

    userService.login(username, password)
      .then(
        user => {
          dispatch(success(user))
          history.push('/')
        },
        error => {
          dispatch(failure(error))
          dispatch(alertActions.error(error))
        }
      )
  }
}

function logout() {
  userService.logout()
  return { type: userConstants.LOGOUT }
}

function resetPassword(email, password, secretKey) {
  function request(user) {
    return { type: userConstants.RESET_PASSWORD_REQUEST, user }
  }
  function success(user) {
    return { type: userConstants.RESET_PASSWORD_SUCCESS, user }
  }
  function failure(error) {
    return { type: userConstants.RESET_PASSWORD_FAILURE, error }
  }

  return dispatch => {
    dispatch(request({ email }))

    userService.resetPassword(email, password, secretKey)
      .then(
        user => {
          dispatch(success(user))
          history.push('/login')
        },
        error => {
          dispatch(failure(error))
          dispatch(alertActions.error(error))
        }
      )
  }
}

function register(name, email, password, secretKey) {
  function request(user) {
    return { type: userConstants.REGISTER_REQUEST, user }
  }
  function success(user) {
    return { type: userConstants.REGISTER_SUCCESS, user }
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error }
  }

  return dispatch => {
    dispatch(request({ email }))

    userService.register(name, email, password, secretKey)
      .then(
        user => {
          dispatch(success(user))
          history.push('/login')
        },
        error => {
          dispatch(failure(error))
          dispatch(alertActions.error(error))
        }
      )
  }
}

function refresh() {
  function request() {
    return { type: userConstants.REFRESH_REQUEST }
  }
  function success(user) {
    return { type: userConstants.REFRESH_SUCCESS, user }
  }
  function failure(error) {
    return { type: userConstants.REFRESH_FAILURE, error }
  }

  return dispatch => {
    let user = JSON.parse(localStorage.getItem('user'))
    dispatch(request(user))

    return new Promise((resolve, reject) => {
      userService.refresh()
        .then(
          data => {
            user = JSON.parse(localStorage.getItem('user'))
            if (user) {
              user.token = data.token
              localStorage.setItem('user', JSON.stringify(user))
            }
            dispatch(success(user))

            resolve(data)
          },
          error => {
            // userService.logout()
            dispatch(failure(error))
            dispatch(alertActions.error(error))

            reject(error)
          }
        )
    })
  }
}

function getAll() {
  function request() {
    return { type: userConstants.GETALL_REQUEST }
  }
  function success(users) {
    return { type: userConstants.GETALL_SUCCESS, users }
  }
  function failure(error) {
    return { type: userConstants.GETALL_FAILURE, error }
  }

  return dispatch => {
    dispatch(request())

    userService.getAll()
      .then(
        users => dispatch(success(JSON.parse(users))),
        error => dispatch(failure(error))
      )
  }
}

export const userActions = {
  login,
  logout,
  getAll,
  resetPassword,
  register,
  refresh
}
