import Taro from "@tarojs/taro";
import { DATA_CODE, MAINHOST } from "@/config";
import { getRouterUrlWithArgs } from "@/utils/common";
import Tips from "@/utils/tips";

interface Config {
  showErrTip?: boolean; // 是否显示错误提示
  tipType?: number; // 提示类型
  server?: number;  // 后台接口地址
  header?: any;
  loading?: boolean, //默认开启loading层
  mask?: boolean, //请求时不需要点击
  title?: string, //loading提示文字
  failToast?: boolean // 一般我们会处理相应业务逻辑，就不直接提示阻断流程
}

interface Method {
  /** HTTP 请求 GET */
  GET
  /** HTTP 请求 POST */
  POST
}

interface OptionTypes {
  data?: any;
  method?: keyof Method;
  url: string;
  header?: any;
  configs?: Config;
}

class Request {

  static getToken() {
    return Taro.getStorageSync("token");
  }

  /**
   *
   * @static request请求
   * @param {Options} opts
   */
  static async http(
    {
      url,
      data,
      method,
      configs
    }: OptionTypes = {
      url: '',
      method: 'POST',
      data: {},
      configs: {}
    }
  ): Promise<any> {
    configs = {
      showErrTip: true,
      tipType: 1,
      server: 0,
      loading: true,
      mask: true,
      title: '数据加载中',
      failToast: false,
      ...configs,
    }

    if (!url) {
      return;
    }

    // 有些请求是不需要带token的 处理下
    const header: any = {
      "Content-Type": "application/json",
      "x-auth-token": this.getToken()
    };

    const options: OptionTypes = {
      data,
      method,
      url: MAINHOST + url,
      header,
    };

    // loading
    if (configs.loading) {
      await Tips.loading()
    }

    //  Taro.request 请求
    const res = await Taro.request(options);

    return new Promise(async (resolve, reject) => {
      await Tips.loaded()
      const {code} = res.data

      // 请求成功
      if (code == DATA_CODE.get('SUCCESS')) {
        return resolve(res.data.data);
      }
      if (code == DATA_CODE.get('LOGIN_DATE') || code == DATA_CODE.get('LOGIN_DATE1')) {
        const urlC = getRouterUrlWithArgs();
        await Taro.showModal({
          title: "提示",
          content: "登录过期，请重新登录～",
          confirmText: "去登录",
          confirmColor: "#ff440a",
          showCancel: false,
          success: () =>
            Taro.redirectTo({
              url: `/pages/login/index?prevRouter=${encodeURIComponent(
                urlC
              )}`,
            }),
        });
        return reject();
      }

      // 请求错误
      const d = {
        ...res.data,
        err: (res.data && res.data.message) || `系统繁忙，请稍后再试～`,
      };

      // 配置项：是否显示错误提示
      if (configs && configs.showErrTip) {
        if ((configs.tipType && configs.tipType === 2) || d.err.length > 15) {
          await Taro.showModal({
            title: "提示",
            content: d.err,
            confirmText: "好的",
            confirmColor: "#666",
            showCancel: false,
          });
        } else {
          Tips.toast(d.err);
        }
      }

      return reject(d);
    });
  }

  static get(url: string, data: any, configs?: Config) {
    return this.http({url, data, method: "GET", configs});
  }

  static post(url: string, data: any, configs?: Config) {
    return this.http({url, data, method: "POST", configs});
  }
}

export default Request;
