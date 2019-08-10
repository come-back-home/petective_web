import React from 'react'
import { Menu, Icon, Typography, Steps, Button } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { config } from '../config'

import classNames from 'classnames/bind'
import styles from './TestContent.scss'
const cx = classNames.bind(styles);
const { Title } = Typography;
const { Step } = Steps;

class Page1_1 extends React.Component {
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
        <Title level={2} className={cx("test-title")}><Icon type="play-circle" /> Page 1</Title>
        <Button type="primary" className={cx("run-button")} loading={this.state.loading} onClick={this.enterLoading}>
          Run
        </Button>

        <div className={cx("test-wrapper")}>
          <Title level={3}>1. Network Test</Title>
          <Steps current={0} className={cx("progress-wrapper")}>
            <Step title="Waiting" description="Prepare scp/scu test." />
            <Step title="In Progress" description="Pending..." />
            <Step title="Finished" description="Done!" />
          </Steps>
        </div>
      </Typography>
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

const connectedContents = connect(mapStateToProps, {
})(Page1_1);
export { connectedContents as Page1_1 }
