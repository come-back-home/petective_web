import { createSelector } from 'reselect'

export const getLoggedIn = state => state.authentication.loggedIn;
export const getUser = state => state.authentication.user;
export const getIsAuthenticated = createSelector(
  getLoggedIn,
  getUser,
  (loggedIn, user) => Boolean(loggedIn && user)
);
