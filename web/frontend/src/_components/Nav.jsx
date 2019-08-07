import React from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { config } from '../config'

import classNames from 'classnames/bind'
import styles from './Nav.scss'
const cx = classNames.bind(styles);

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: ''
    }
  }

  handleClick = (e) => {
    if (e.key === 'logo') {
      return
    }
    this.setState({
      current: e.key
    })
  };

  render() {
    return (
      <Menu
        className={cx('navContainer')}
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode='horizontal'
      >
        <Menu.Item className={cx('logo')} key='logo'>
          <a href='/'>
            <img style={{ height: '16px' }}
              src={config.apiUrl + '/static/assets/icons/CI.png'}
              alt='logo' />
          </a>
        </Menu.Item>
        <SubMenu className={cx('settings')} title={
          <Icon type='setting' />
        }>
          <MenuItemGroup title='User'>
            <Menu.Item key='setting:logout'>
              <Link to='/login'>Logout</Link>
            </Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <Menu.Item className={cx('userInfo')} key='userInfo' disabled>
          <span className={cx('username')}>
            &nbsp;&nbsp; | &nbsp;&nbsp;
            <Icon type='user' />
            { this.props.user &&
            this.props.user.name }
          </span>
        </Menu.Item>
      </Menu>
    )
  }
}
function mapStateToProps(state) {
  const { authentication } = state;
  const { user } = authentication;
  return {
    authentication,
    user
  }
}

const connectedNav = connect(mapStateToProps, {
})(Nav);
export { connectedNav as Nav }
