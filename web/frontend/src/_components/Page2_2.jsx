import React from 'react'
import {Menu, Icon, Typography, Steps, Button, Tabs, Divider} from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { config } from '../config'

import classNames from 'classnames/bind'
import styles from './TestContent.scss'
const cx = classNames.bind(styles);
const { Title } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;

class Page2_2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: ''
    }
  }

  state = {
    loading: false,
    iconLoading: false,
    current: 0,
  };

  enterLoading = () => {
    this.setState({ loading: true });
  };

  enterIconLoading = () => {
    this.setState({ iconLoading: true });
  };

  onChange = current => {
    console.log('onChange:', current);
    this.setState({ current });
  };



  render() {
    const { current } = this.state;
    return (
      <Typography>
        <Title level={2} className={cx("test-title")}><Icon type="ant-design" /> Register : I Found </Title>

        <br/><br/>
        <Tabs defaultActiveKey="1" onChange={callback} className={cx("side-wrapper")}>
          <TabPane tab="1" key="1">
            <h1>Register</h1><br/>
            1. Register the found dog pictures on 'Register/I Found' tab.<br/>
            &ensp; &nbsp; You should upload more than three.<br/><br/>
            2. Please fill out the offered finder blanks.
          </TabPane>
          <TabPane tab="2" key="2">
            <h1>In Progress</h1><br/>
            1. Petective learns your pictures.<br/>
            &ensp; &nbsp; How? Machine learning will help us to recognize.<br/><br/>
            2. Now, you can look up the information about the dog.
          </TabPane>
          <TabPane tab="3" key="3">
            <h1>Find!</h1><br/>
            1. If the picture you uploaded matches with already enrolled dog, we will inform to the owner of the dog.<br/><br/>
            2. You can confirm whether the dog went back to his family.<br/>
            &ensp; &nbsp; Also you can see review the owner thanks to you.
          </TabPane>
        </Tabs>
      </Typography>
    )
  }
}


function callback(key) {
  console.log(key);
}

function mapStateToProps(state) {
  const { authentication } = state;
  const { user } = authentication;
  return {
    authentication,
    user
  }
}

const connectedContents = connect(mapStateToProps, {
})(Page2_2);
export { connectedContents as Page2_2 }
