import React from 'react'
import {
  Form, Icon, Input, Button, Checkbox, Spin
} from 'antd'
import { userActions } from '../_actions'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import styles from './LoginForm.module.scss'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)

class LoginForm extends React.Component {
  constructor(props) {
    super(props)

    this.props.logout()

    this.state = {
      username: '',
      password: '',
      submitted: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    this.props.form.validateFields((err) => {
      if (!err) {
        const { email, password } = this.state
        if (email && password) {
          this.props.login(email, password)
        }
      }
    })
  }

  render() {
    const { loggingIn } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={cx('login-form')}>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input name='email'
              onChange={this.handleChange}
              prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Email' />
          )}
        </Form.Item>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input name='password'
              onChange={this.handleChange}
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password' placeholder='Password' />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(
            <Checkbox className={cx('remember')}>Remember me</Checkbox>
          )}
          <Button type='primary' htmlType='submit'
            style={{ marginTop: '0' }}
            className={cx('login-button')}>
            Log in
          </Button>
          <Link className={cx('signup-button')} to='/register'>Sign up</Link>
          <Link className={cx('forgot-button')} to='/forgot'>Forgot?</Link>
        </Form.Item>
        {loggingIn &&
          <Spin />
        }
      </Form>
    )
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication
  return {
    loggingIn
  }
}

const connectedLoginForm = connect(mapStateToProps, {
  logout: userActions.logout,
  login: userActions.login
})(LoginForm)
export { connectedLoginForm as LoginForm }
