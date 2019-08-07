import {config} from '../config'
import {authHeader, refreshHeader} from '../_helpers'
import {userService} from "./user.service";


function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        userService.logout()
        // window.location.reload(true)
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error)
    }

    return data
  })
}


function get(uri) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${config.apiUrl + uri}`, requestOptions).then(handleResponse)
}


function post(uri, jsondata) {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: jsondata
  };
  return fetch(`${config.apiUrl + uri}`, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response.data
    })
}


function put(uri, jsondata) {
  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: jsondata
  };
  return fetch(`${config.apiUrl + uri}`, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response.data
    })
}


function del(uri, jsondata) {
  const requestOptions = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: jsondata
  };
  return fetch(`${config.apiUrl + uri}`, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response.data
    })
}


export const networkUtils = {
  get,
  post,
  put,
  del
};
