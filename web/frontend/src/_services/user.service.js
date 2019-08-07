import { config } from '../config'
import { authHeader, refreshHeader } from '../_helpers'

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout()
        // window.location.reload(true)
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error)
    }

    return data
  })
}

function login(email, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  };
  return fetch(`${config.apiUrl}/api/auth/login`, requestOptions)
    .then(handleResponse)
    .then(response => {
      // login successful if there's a jwt token in the response
      if (response.data.token) {
        // store user details and jwt token in
        // local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(response.data))
      }

      return response.data
    })
}

function resetPassword(email, password, secretKey) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, secretKey })
  };
  return fetch(`${config.apiUrl}/api/users`, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response.data
    })
}

function register(name, email, password, secretKey) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, secretKey })
  };
  return fetch(`${config.apiUrl}/api/auth/register`, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response.data
    })
}

function refresh() {
  const requestOptions = {
    method: 'POST',
    headers: refreshHeader()
  };
  return fetch(`${config.apiUrl}/api/auth/refresh`, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response.data
    })
}

function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/users`, requestOptions).then(handleResponse)
}

export const userService = {
  login,
  logout,
  getAll,
  resetPassword,
  register,
  refresh
};
