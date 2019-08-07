import React from 'react'
import { connect } from 'react-redux'
import { Nav } from '../_components'
import {
  getIsAuthenticated
} from '../_selectors'

const NavContainer = props => <Nav {...props} />

const mapStateToProps = (state) => {
  const { authentication } = state
  const { user } = authentication || {}

  return {
    user,
    isAuthenticated: getIsAuthenticated(state)
  }
}

const connectedPostContainer = connect(mapStateToProps)(NavContainer)
export { connectedPostContainer as NavContainer }
