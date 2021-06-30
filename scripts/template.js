/**
 * pages页面快速生成脚本
 * 用法：npm run tep `文件名`
 */

const fs = require("fs");

const dirName = process.argv[2];
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);
if (!dirName) {
  console.log("文件夹名称不能为空！");
  console.log("示例：npm run tep test");
  process.exit(0);
}

//页面模板
const indexTep = `import { useEffect, useState } from 'react';
import { FC } from '@tarojs/taro';
import { observer } from 'mobx-react';
import { View } from "@tarojs/components";
import { } from '@/components/index';
import { } from "taro-ui";
import { } from '@/utils/common';
import { ${capPirName}Store } from '@/store/index';
import { ${capPirName}Types } from '@/types/store/${dirName}.interface';
import Tips from "@/utils/tips";
import './index.scss';

const ${capPirName}:FC = () => {
  const {}: ${capPirName}Types = ${capPirName}Store

  return (
    <View className='${dirName}-wrap'>

    </View>
  )
}
export default observer(${capPirName})
`;

// scss文件模版
const scssTep = `@import "@/assets/scss/variables";

.${dirName}-wrap {
  width: 100%;
  min-height: 100vh;
}
`;

const configTep = `export default {
  navigationBarTitleText: '${capPirName}'
}
`

//store模板
const storeTep = `import { makeAutoObservable, configure, runInAction } from 'mobx'
import Request from '@/utils/request'
import api from "@/config/api";
import { ${capPirName}Types } from '@/types/store/${dirName}.interface';

configure({ enforceActions: 'observed' })

const {} = api;

class ${capPirName}Store implements ${capPirName}Types{
  [key: string]: any
  constructor() {
    makeAutoObservable(this);
  }

  public storeName: string = '${dirName}'

  // 更新state
  updateState = (params: ${capPirName}Types) => {
    for (let [key, value] of Object.entries(params)) {
      this[key] = value
    }
  }
}

export default new ${capPirName}Store()
`;

const typeTep = `export interface ${capPirName}Types {
  [key: string]: any
  storeName: string
}
`;

fs.mkdirSync(`./src/pages/${capPirName}`); // mkdir $1
process.chdir(`./src/pages/${capPirName}`); // cd $1

fs.writeFileSync("index.tsx", indexTep); //jsx
fs.writeFileSync("index.scss", scssTep); // scss
fs.writeFileSync(`index.config.ts`, configTep); // config

process.chdir("../../"); // cd $1
process.chdir("./store"); // cd $1
fs.writeFileSync(`${dirName}Store.ts`, storeTep); // store

process.chdir("../"); // cd $1
process.chdir("./types/store"); // cd $1
fs.writeFileSync(`${dirName}.interface.ts`, typeTep); // store
process.exit(0);
