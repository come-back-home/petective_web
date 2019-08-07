import React from 'react'
import { connect } from 'react-redux'
import { LeftMenu } from '../_components'
import {
  getIsAuthenticated
} from '../_selectors'

const LeftMenuContainer = props => <LeftMenu {...props} />;

const connectedPostContainer = (LeftMenuContainer);
export { connectedPostContainer as LeftMenuContainer }
