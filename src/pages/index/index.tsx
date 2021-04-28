import React, { useEffect, useState } from 'react';
import { FC } from '@tarojs/taro';
import { observer } from 'mobx-react';
import { View } from "@tarojs/components";
import { Test } from '@/components/index';
import { } from "taro-ui";
import { } from '@/utils/common';
import { IndexStore } from '@/store/index';
import { IndexTypes } from '@/types/store/index.interface';
import Tips from "@/utils/tips";
import './index.scss';

const Index:FC = () => {
  const { storeName }: IndexTypes = IndexStore

  return (
    <View className='index-wrap'>
      <Test />
    </View>
  )
}
export default observer(Index)
