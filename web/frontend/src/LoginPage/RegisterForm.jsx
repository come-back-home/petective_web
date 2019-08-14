import React from 'react'
import {
  Form, Icon, Input, Spin, Button
} from 'antd'
import { userActions } from '../_actions'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import styles from './LoginForm.module.scss'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles);

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      secretKey: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    this.props.form.validateFields((err) => {
      if (!err) {
        const { name, email, phone, address, password, secretKey } = this.state;
        const { dispatch } = this.props;
        if (name && email && phone && address && password && secretKey) {
          dispatch(userActions.register(name, email, phone, address, password, secretKey))
        }
      }
    })
  }

  render() {
    const { loggingIn } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={cx('login-form')}>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input name='name'
              onChange={this.handleChange}
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Name' />
          )}
        </Form.Item>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }]
          })(
            <Input name='email'
              onChange={this.handleChange}
              prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Email' />
          )}
        </Form.Item>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }]
          })(
            <Input name='phone'
              onChange={this.handleChange}
              prefix={<Icon type='phone' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='phone' />
          )}
        </Form.Item>
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('address', {
            rules: [{ required: true, message: 'Please input your address!' }]
          })(
            <Input name='address'
              onChange={this.handleChange}
              prefix={<Icon type='home' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='address' />
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
        <Form.Item style={{ margin: '0 0 6px 0' }}>
          {getFieldDecorator('secretKey', {
            rules: [{ required: true, message: 'Please input Secret Key!' }]
          })(
            <Input name='secretKey'
              onChange={this.handleChange}
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password' placeholder='Secret Key' />
          )}
        </Form.Item>
        <Form.Item style={{ margin: '0 0 12px 0' }}>
          <Button type='primary' htmlType='submit'
            className={cx('login-button')}>
            Register
          </Button>
          <Link className={cx('signup-button')} to='/login'>Sign In</Link>
        </Form.Item>
        {loggingIn &&
          <Spin />
        }
      </Form>
    )
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  return {
    loggingIn
  }
}

const connectedRegisterForm = connect(mapStateToProps)(RegisterForm);
export { connectedRegisterForm as RegisterForm }
