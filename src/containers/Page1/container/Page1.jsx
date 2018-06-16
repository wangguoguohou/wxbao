import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {test} from '../actions/Page1'
import { Modal, List, Button, WhiteSpace, WingBlank, Badge, Tabs, SearchBar} from 'antd-mobile';
import '../style/Page1.less'

const tabs2 = [
  { title: 'First Tab', sub: '1' },
  { title: 'Second Tab', sub: '2' },
  { title: 'Third Tab', sub: '3' },
];

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class Page1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      modal2: false,
    };
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  render() {
    return (
      <div>
          <WingBlank>
            <div className="sub-title">
              <span>微宝</span><span>微宝</span>
            </div>
          </WingBlank>
          <WingBlank>
            <SearchBar placeholder="自动获取光标" ref={ref => this.autoFocusInst = ref} />
          </WingBlank>
          
          <WhiteSpace />
      </div>
    );
  }
}

export default Page1;