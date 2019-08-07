import React from 'react'
import styles from './App.module.scss'
import { Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import { history } from './_helpers'
import { alertActions } from './_actions'
import { PrivateRoute } from './_components'
import { HomePage } from './HomePage'
import { LoginPage } from './LoginPage'
import { ForgotPage } from './ForgotPage'
import classNames from 'classnames/bind'
import { Alert, Breadcrumb } from 'antd'

const cx = classNames.bind(styles);

class App extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    history.listen((/* location, action */) => {
      // clear alert on location change
      dispatch(alertActions.clear())
    })
  }

  render() {
    const { alert } = this.props;
    return (
      <div className={cx('wrapper')}>
        { alert.message &&
          <Alert banner message={alert.message} type={alert.type} />
        }
        <Router history={history}>
          <div className={cx('container')}>
            <PrivateRoute exact path='/' component={HomePage} {...this.props} />
            <Route path='/login' component={LoginPage} />
            <Route path='/forgot' component={ForgotPage} />
            <Route path='/register' component={LoginPage} />
          </div>
        </Router>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert
  }
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }
