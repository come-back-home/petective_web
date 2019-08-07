import React from 'react'
import { Form } from 'antd'
import classNames from 'classnames/bind'
import styles from './ForgotPage.module.scss'
import { ForgotForm } from './ForgotForm'
import { config } from '../config'

const cx = classNames.bind(styles);

class ForgotPage extends React.Component {
  render() {
    const WrappedForgotForm = Form.create()(ForgotForm);
    return (
      <div className={cx('wrapper')}>
        <div className={cx('container')}>
          <div className={cx('login')}>
            <h1>RESET PW</h1>
            <h2>Petective - <strong>{config.appName}</strong></h2>
            <WrappedForgotForm />
          </div>
        </div>
      </div>
    )
  }
}

export { ForgotPage }
