import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import Taro, { useScope } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { getRouterUrl } from '@/utils/common';
import _store from './store';
import './index.scss'

function CustomTabBar() {
  const store = useContext(_store)
  const { selected } = store;

  const [color] = useState("#666666");
  const [selectedColor] = useState("#D1302C");
  const [backgroundColor] = useState("#FFFFFF");
  const [borderStyle] = useState("white");
  const [tabList] = useState([
    {
      pagePath: '/pages/index/index',
      text: '商城',
      icon: 'iconshop',
    },
    {
      pagePath: '/pages/featured/index',
      text: '精选',
      icon: 'icon02-fanganguanli',
    },
    {
      pagePath: '/pages/store/index',
      text: '店铺',
      icon: 'iconappstore',
    },
    {
      pagePath: '/pages/my/index',
      text: '我的',
      icon: 'iconuser',
    }
  ])

  useEffect(() => {
    const currentUrl = getRouterUrl(1)
    const checkIndex = tabList.findIndex(item => item.pagePath === `/${currentUrl}`);
    checkIndex >= 0 && selected !== checkIndex && store.setSelect(checkIndex);
  }, [])


  const handleTab = ( e, i ) => {
    store.setSelect(i)
    Taro.switchTab({ url: e.pagePath });
  }

  return (
    <View className='fx-tab-bar' style={{ backgroundColor }}>
      <View className='fx-tab-bar-fixed'>
        <View className='fx-tab-bar-border' style={{ backgroundColor: borderStyle }} />
        {
          tabList.map(( item, index ) => {
            return (
              <View className='fx-tab-bar-item' key={`tab-bar-item-${index}`} style={{ color: selected === index ? selectedColor : color }} onClick={() => handleTab(item, index)}>
                <View className={`iconfont fx-tab-bar-icon ${item.icon}`} />
                <View className='fx-tab-bar-text'>{item.text}</View>
              </View>
            )
          })
        }
      </View>
    </View>
  )
}

CustomTabBar.options = {
  addGlobalClass: true
}
export default observer(CustomTabBar)
