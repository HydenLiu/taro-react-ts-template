/*
 * @Description: 不同环境API地址
 */
const ApiHost = {
  MOCK: "http://api-doc.koudaiqifu.cn:9090/mock/xx", // mock地址
  DEV: "http://xxx", // 开发环境
  QA: "https://xxx", // 测试环境
  PROD: "https://xxx", // 线上环境
}

export const ENV = 'QA';
export const MAINHOST = [ApiHost[ENV]]

/**
 * http请求状态码
 */
type codeType=string|number;

export const DATA_CODE:Map<string,codeType> = new Map([
  ["SUCCESS", "2000"],
  ["QUERY_PARAMS_ERROR", "4000"],
  ["LOGIN_INVALID", "100003"],
  ["OTHER_ERROR", "5000"],
]);

/**
 * 全局的分享信息
 */
export const SHAREINFO = {
  'title': 'xx小程序',
  'path': '/pages/index/index',
  // 'imageUrl': 'https://img02.fxqifu.com/welfare/2019/1560148820381cpe81jjk6s6.png'
}

/**
 * 客服电话
 */
export const CONTRACTPHONE = '0571-81389117'


