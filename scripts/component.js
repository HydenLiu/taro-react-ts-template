const fs = require('fs');

const dirName = process.argv[2];
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);
if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep test');
  process.exit(0);
}

//页面模板
const indexTep = `import { useEffect, useState } from 'react';
import { FC } from '@tarojs/taro';
import { ${capPirName}Types } from '@/types/components/${dirName}.interface';
import { View } from "@tarojs/components";
import './index.scss';

const ${capPirName}: FC<${capPirName}Types> = (props: ${capPirName}Types) => {

  return (
    <View className='${dirName}_wrap'>

    </View>
  )
}
${capPirName}.defaultProps = {}
${capPirName}.options = {
  addGlobalClass: true
}
export default ${capPirName}
`

// scss文件模版
const scssTep = `@import "@/assets/scss/variables";

.${dirName}{
  &-wrap {

  }
}
`

const typeTep = `export interface ${capPirName}Types {
  [key: string]: any
}
`

fs.mkdirSync(`./src/components/${capPirName}`); // mkdir $1
process.chdir(`./src/components/${capPirName}`); // cd $1

fs.writeFileSync(`index.tsx`, indexTep); //jsx
fs.writeFileSync(`index.scss`, scssTep); // scss

process.chdir('../../'); // cd $1
process.chdir('./types/components'); // cd $1
fs.writeFileSync(`${dirName}.interface.ts`, typeTep); // store

process.exit(0);
