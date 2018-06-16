import React, { Component } from 'react';
import { connect } from 'react-redux'
import {test} from '../actions/Page2'

@connect(
  state => state.Page2,
  {test}
)

class Page2 extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        Page2
      </div>
    );
  }
}

export default Page2;