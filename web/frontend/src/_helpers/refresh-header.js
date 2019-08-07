export const refreshHeader = () => {
  let user = JSON.parse(localStorage.getItem('user'))

  if (user && user.refresh) {
    return { Authorization: 'Bearer ' + user.refresh }
  }
  return {}
}
