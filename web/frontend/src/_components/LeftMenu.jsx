import React from 'react'
import { Menu, Icon, Layout, Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { config } from '../config'
import { TestAll } from "./TestAll";

import classNames from 'classnames/bind'
//import styles from '../_styles/antd.scss'
//const cx = classNames.bind(styles)

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const MenuItemGroup = Menu.ItemGroup;


class LeftMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: '',
      contents: <TestAll />,  // default page
      status: 0  // whether the test is running
    }
  }

  menu_click = (e) => {
    if (this.state.status === 0) {  // check the test is running
      this.setState({location: e.key});
      switch (e.key) {
        case '1':
          this.setState({contents: <TestAll/>});
          break;
      }
    }
  };

  render() {
    let contents = <TestAll />;

    return (
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="play-circle" />
                  Combined Test
                </span>
              }
            >
              <Menu.Item key="1" onClick={this.menu_click}>Test All</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              marginTop: 24,
              minHeight: 280,
            }}
          >
            { this.state.contents }
          </Content>
        </Layout>
      </Layout>
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

const connectedLeftMenu = connect(mapStateToProps, {
})(LeftMenu);
export { connectedLeftMenu as LeftMenu }
