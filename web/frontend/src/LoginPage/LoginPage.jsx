import React from 'react'
import { Form } from 'antd'
import classNames from 'classnames/bind'
import styles from './LoginPage.module.scss'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { history } from '../_helpers'
import { config } from '../config'

const cx = classNames.bind(styles);

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoginPage: history.location.pathname === '/login',
      isRegisterPage: history.location.pathname === '/register'
    };
    this.WrappedLoginForm = Form.create()(LoginForm);
    this.WrappedRegisterForm = Form.create()(RegisterForm)
  }
  render() {
    const WrappedLoginForm = this.WrappedLoginForm;
    const WrappedRegisterForm = this.WrappedRegisterForm;
    return (
      <div className={cx('wrapper')}>
        <div className={cx('container')}>
          {this.state.isLoginPage &&
            <div className={cx('login')}>
              <img
                src={config.apiUrl + '/static/assets/icons/CI.png'}
                alt='Petective-CI'
              />
              <h2>2019 SV - <strong>{config.appName}</strong></h2>
              <WrappedLoginForm />
            </div>
          }
          {this.state.isRegisterPage &&
            <div className={cx('login')}>
              <h1>REGISTER</h1>
              <h2>2019 SV - <strong>{config.appName}</strong></h2>
              <WrappedRegisterForm />
            </div>
          }
        </div>
      </div>
    )
  }
}

export { LoginPage }
