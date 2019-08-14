import React from 'react'
import { Menu, Icon, Typography, Steps, Button, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { config } from '../config'

import classNames from 'classnames/bind'
import styles from './TestContent.scss'
const cx = classNames.bind(styles);
const { Title } = Typography;
const { Step } = Steps;
const { Paragraph, Text } = Typography;

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
        <Title level={2} className={cx("test-title")}><Icon type="ant-design" /> Why Petective </Title>
        <Paragraph className={cx("test-wrapper")}>
          Every year, there are more than one hundred thousand animals lost.
          Petective will help you to find your family.
          <br/>Just upload your lost pet dog. Petective will learn the face of the dog.
          <br/>After that if the person who found the dog registers the photo, Petective will inform you where is your lovely dog.
          <br/><br/>We call it Pet - Detective :&ensp; Petective
          {/*<Text strong>*/}
          {/*  We call it Pet Detective : Petective.*/}
          {/*</Text>*/}
        </Paragraph>
        <br/><br/>



        <Title level={2} className={cx("test-title")}><Icon type="ant-design" /> Members </Title>
        <Paragraph className={cx("test-wrapper")}>
          <ul>
            <li>
              <a href="/docs/spec/proximity">Minwoo Choo</a> :&ensp; Team leader, Backend web programming, DB, ML, Cryptography, Deployment, UI/UX design
            </li>
            <li>
              <a href="/docs/pattern/navigation">Yoon Bang</a> :&ensp; Frontend seb programming, DB, ML, Data analysis/processing, UI/UX design
            </li>
            <li>
              <a href="/docs/resource/download">Jongwan Hong</a> :&ensp; Data analysis / pre-processing
            </li>
            <li>
              <a href="/docs/resource/download">Seongwook Song</a> :&ensp; Data analysis / pre-processing, ML
            </li>
          </ul>
        </Paragraph>

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
