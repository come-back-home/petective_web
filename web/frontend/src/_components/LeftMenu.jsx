import React from 'react'
import { Menu, Icon, Layout, Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { config } from '../config'

import { TestAll } from "./TestAll";
import { page1_1 } from "./page1_1";
import { page1_2 } from "./page1_2";
import { page1_3 } from "./page1_3";
import { page2_1 } from "./page2_1";
import { page2_2 } from "./page2_2";
import { page3 } from "./page3";


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
        case '0':
          this.setState({contents: <TestAll/>});
          break;
        case '1_1':
          this.setState({contents: <page1_1/>});
          break;
        case '1_2':
          this.setState({contents: <page1_2/>});
          break;
        case '1_3':
          this.setState({contents: <page1_3/>});
          break;
        case '2_1':
          this.setState({contents: <page2_1/>});
          break;
        case '2_2':
          this.setState({contents: <page2_2/>});
          break;
        case '3_1':
          this.setState({contents: <page3/>});
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
            defaultSelectedKeys={['0']} /*ㅅㅐㄹㅗㄱㅗㅊㅣㅁ*/
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="play-circle" />
                  Why Petective
                </span>
              }
            >
              <Menu.Item key="1_1" onClick={this.menu_click}>About Us</Menu.Item>
              <Menu.Item key="1_2" onClick={this.menu_click}>How to Use</Menu.Item>
              <Menu.Item key="1_3" onClick={this.menu_click}>Notice</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="play-circle" />
                  Register
                </span>
              }
            >
              <Menu.Item key="2_1" onClick={this.menu_click}>Upload Pictures</Menu.Item>
              <Menu.Item key="2_2" onClick={this.menu_click}>Confirm</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="play-circle" />
                  Review
                </span>
              }
            >
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
