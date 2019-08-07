import React from 'react'
import {
  Form, Icon, Input, Button, Spin
} from 'antd'
import { userActions } from '../_actions'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import styles from './ForgotForm.module.scss'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles);

class ForgotForm extends React.Component {
  constructor(props) {
    super(props);

    this.props.dispatch(userActions.logout());

    this.state = {
      email: '',
      password: '',
      secretKey: '',
      submitted: false,
      confirmDirty: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  };

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true });
    this.props.form.validateFields((err) => {
      if (!err) {
        const { email, password, secretKey } = this.state;
        const { dispatch } = this.props;
        if (email && password && secretKey) {
          dispatch(userActions.resetPassword(email, password, secretKey))
        }
      }
    })
  }

  render() {
    const { resetingIn } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={cx('reset-form')}>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input name='email' onChange={this.handleChange}
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='email' />
          )}
        </Form.Item>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input name='password'
              onChange={this.handleChange}
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password' placeholder='New Password' />
          )}
        </Form.Item>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!'
            }, {
              validator: this.compareToFirstPassword
            }]
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              onBlur={this.handleConfirmBlur}
              placeholder='Confirm your password' />
          )}
        </Form.Item>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('secretKey', {
            rules: [{ required: true, message: 'Please input secret key' }]
          })(
            <Input name='secretKey'
              onChange={this.handleChange}
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password' placeholder='Secret Key' />
          )}
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' className={cx('reset-button')}>
            Reset Password
          </Button>
          <Link className={cx('login-button')} to='/login'>Sign In</Link>
        </Form.Item>
        {resetingIn &&
          <Spin />
        }
      </Form>
    )
  }
}

function mapStateToProps(state) {
  const { resetingIn } = state.resetPassword;
  return {
    resetingIn
  }
}

const connectedForgotForm = connect(mapStateToProps)(ForgotForm);
export { connectedForgotForm as ForgotForm }
