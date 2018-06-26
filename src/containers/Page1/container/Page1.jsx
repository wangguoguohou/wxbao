import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {test} from '../actions/Page1'
import { Modal, List, Button, WhiteSpace, WingBlank, Badge, Tabs, SearchBar, Flex} from 'antd-mobile';
import '../style/Page1.less'

//tab类别需要请求接口获得
const tabs = [
      { title: '推荐' },
      { title: '亲子' },
      { title: '数码' },
      { title: '4th Tab' },
      { title: '5th Tab' },
      { title: '6th Tab' },
      { title: '7th Tab' },
      { title: '8th Tab' },
      { title: '9th Tab' },
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
      <div className="promotion-goods">
          <WingBlank>
            <div className="sub-title">
              <span>微销宝</span>
            </div>
            <SearchBar placeholder="自动获取光标" ref={ref => this.autoFocusInst = ref} />
            <WhiteSpace />
            <Tabs tabs={tabs}
              initialPage={0}
              onChange={(tab, index) => { console.log('onChange', index, tab); }}
              onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}>
              <div style={{ display: 'flex', height: '550px', backgroundColor: '#fff' }}>
                <div className="goods-box">
                  <div className="item">
                    <div className="flex img">111</div>
                    <div className="flex content">1112</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
                Content of second tab
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
                Content of third tab
              </div>
            </Tabs>
          </WingBlank>
          
          <WhiteSpace />
      </div>
    );
  }
}

export default Page1;