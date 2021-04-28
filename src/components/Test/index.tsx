import { useEffect, useState } from 'react';
import { FC } from '@tarojs/taro';
import { TestTypes } from '@/types/components/test.interface';
import { View } from "@tarojs/components";
import './index.scss';

const Test: FC<TestTypes> = (props: TestTypes) => {

  return (
    <View className='test_wrap'>
      我是test组件
    </View>
  )
}
Test.defaultProps = {}
Test.options = {
  addGlobalClass: true
}
export default Test
