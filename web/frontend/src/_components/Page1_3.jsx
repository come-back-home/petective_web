import React from 'react'
import { Menu, Icon, Typography, Steps, Button, Collapse } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { config } from '../config'

import classNames from 'classnames/bind'
import styles from './TestContent.scss'
const cx = classNames.bind(styles);
const { Title } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found:a welcome guest in many households across the world.
`;

class Page1_3 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: ''
    }
  }

  state = {
    loading: false,
    iconLoading: false,
  };

  enterLoading = () => {
    this.setState({ loading: true });
  };

  enterIconLoading = () => {
    this.setState({ iconLoading: true });
  };

  render() {
    return (
      <Typography>
          <Title level={2} className={cx("test-title")}><Icon type="ant-design" /> Notice </Title>
          <Collapse onChange={ this.callback } className={cx("test-wrapper")}>
            <Panel header=" Notice 1" key="1">
              <Collapse defaultActiveKey="1">
                <Panel header=" This is panel nest panel" key="1">
                  <p>{text}</p>
                </Panel>
              </Collapse>
            </Panel>
            <Panel header=" Notice 2" key="2">
              <p>{text}</p>
            </Panel>
            <Panel header=" Notice 3" key="3">
              <p>{text}</p>
            </Panel>
          </Collapse>
      </Typography>
    )
  }
}

function callback(key) {
  console.log(key);
};

function mapStateToProps(state) {
  const { authentication } = state;
  const { user } = authentication;
  return {
    authentication,
    user
  }
}

const connectedContents = connect(mapStateToProps, {
})(Page1_3);
export { connectedContents as Page1_3 }
