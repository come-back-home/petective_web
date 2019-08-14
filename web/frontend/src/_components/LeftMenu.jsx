import React from 'react'
import { Menu, Icon, Layout, Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { config } from '../config'
import { TestAll } from "./TestAll";
import { Page1_1 } from "./Page1_1";
import { Page1_2 } from "./Page1_2";
import { Page1_3 } from "./Page1_3";
import { Page2_1 } from "./Page2_1";
import { Page2_2 } from "./Page2_2";
import { Page3_1 } from "./Page3_1";

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
          this.setState({contents: <Page1_1/>});
          break;
        case '1_2':
          this.setState({contents: <Page1_2/>});
          break;
        case '1_3':
          this.setState({contents: <Page1_3/>});
          break;
        case '2_1':
          this.setState({contents: <Page2_1/>});
          break;
        case '2_2':
          this.setState({contents: <Page2_2/>});
          break;
        case '3_1':
          this.setState({contents: <Page3_1/>});
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
                  <Icon type="sound" />
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
                  <Icon type="form" />
                  Register
                </span>
              }
            >
              <Menu.Item key="2_1" onClick={this.menu_click}>I Lost</Menu.Item>
              <Menu.Item key="2_2" onClick={this.menu_click}>I Found</Menu.Item>
            </SubMenu>
            <Menu.Item key="3_1" onClick={this.menu_click}>
              <Icon type="message" />
              <span>Review</span>
            </Menu.Item>
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


