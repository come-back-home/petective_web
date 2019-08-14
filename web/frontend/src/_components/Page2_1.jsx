import React from 'react'
import {Menu, Icon, Typography, Steps, Button, Tabs, Divider, Input, Form} from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { config } from '../config'
import { networkUtils } from '../_services'

import classNames from 'classnames/bind'
import styles from './TestContent.scss'
import {userActions} from "../_actions";
import {TestAll} from "./TestAll";

const cx = classNames.bind(styles);
const { Title, Text } = Typography;

class Page2_1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pic1: '',
      pic2: '',
      pic3: '',
      pic4: '',
      current: '',
      user_id: '',
      name: '',
      sex: '',
      breed: '',
      submitted: false
    };
  }

  onChange = current => {
    console.log('onChange:', current);
    this.setState({ current });
  };

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }

  handleSubmit(e) {
    e.preventDefault();
    alert('A name was submitted: ' + this.state.value);

    this.setState({ submitted: true });
  }

  upload(){
    let data = {
            /*user_id : ,*/
      name : document.getElementById("mypet-name").value,
      sex : document.getElementById("mypet-sex").value,
      breed : document.getElementById("mypet-breed").value,
      pic1 : document.getElementById("mypet-pic1").value,
      pic2 : document.getElementById("mypet-pic2").value,
      pic3 : document.getElementById("mypet-pic3").value,
      pic4 : document.getElementById("mypet-pic4").value,
    };
    networkUtils.post("/api/mypet/register", data);
}

  render() {
    const { current } = this.state;

    return (
      <Typography>
        <Title level={2} className={cx("test-title")}><Icon type="ant-design" /> Register : I Lost </Title>
        <div className={cx("register-form")}>
          <br/>
          <Text strong>1. Register your lost dog pictures or video clips more than three. You should upload his/her front face.</Text><br/><br/>

          <label>
            Picture 1 &ensp; <input type="file" id="mypet-pic1" className={cx("pic")} value={this.state.pic1} onChange={this.handleChange} />
          </label><br/><br/>
          <label>
            Picture 2 &ensp; <input type="file" id="mypet-pic2" className={cx("pic")} value={this.state.pic2} onChange={this.handleChange} />
          </label><br/><br/>
          <label>
            Picture 3 &ensp; <input type="file" id="mypet-pic3" className={cx("pic")} value={this.state.pic3} onChange={this.handleChange} />
          </label><br/><br/>
          <label>
            Picture 4 &ensp; <input type="file" id="mypet-pic4" className={cx("pic")} value={this.state.pic4} onChange={this.handleChange} />
          </label><br/><br/>


          <Text strong>2. Please complete the registration form about your pet.</Text>
          <br/><br/>
          <label>
            Pet Name <br/>
            <input type="text" id="mypet-name" value={this.state.name} onChange={this.handleChange} />
          </label><br/><br/>
          <label>
            Pet Sex <br/>
            <input type="text" id="mypet-sex" value={this.state.sex} onChange={this.handleChange} />
          </label><br/><br/>
          <label>
            Pet Breed <br/>
            <input type="text" id="mypet-breed" value={this.state.breed} onChange={this.handleChange} />
          </label><br/><br/>

          <button className={cx("submit")} onClick={this.upload()} >Submit</button>
        </div>
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
})(Page2_1);
export { connectedContents as Page2_1 }
