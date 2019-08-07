// import { createSelector } from 'reselect'

export const getEntities = state => state.entities;
export const getWidth = state => state.environment.width;
export const getHeight = state => state.environment.height;
export const getPath = state => state.router.route.path;
