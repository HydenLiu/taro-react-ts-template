import Taro from "@tarojs/taro";
import { ENV, MAINHOST, DATA_CODE } from "@/config";
import Api from "../config/api";
import { getRouterUrlWithArgs } from "@/utils/common";
import Tips from "@/utils/tips";

interface Config {
  showErrTip?: boolean;
  tipType?: number;
  server?: number;
  header?: any
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
  config?: Config;
}

class Request {
  //登陆的promise
  static loginReadyPromise: any = Promise.resolve();
  // 正在登陆
  static isLogining = false;

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
      config
    }: OptionTypes = {
      url: '', 
      method: 'GET', 
      data: {}, 
      config: { showErrTip: true, tipType: 1, server: 0}
    }
  ) {

    if (!Api[url]) {
      return;
    }

    // 有些请求是不需要带token的 处理下
    let header: any  = { 
      "Content-Type": "application/json",
      authority_token: this.getToken()
    };

    const host =
    config && config.server && typeof config.server === "number"
        ? MAINHOST[config.server]
        : MAINHOST[0];
    let options: OptionTypes = {
      data,
      method,
      url: host + Api[url],
      header,
    };

    //  Taro.request 请求
    const res = await Taro.request(options);

    // 登陆失效
    if (res.data.code === DATA_CODE.get('LOGIN_INVALID')) {
      await this.login(url);
      return this.http({url, data, method, config});
    }

    return new Promise(async (resolve, reject) => {
      // 是否mock
      if (ENV === 'MOCK') {
        return resolve(res.data);
      }
      // 请求成功
      if (res.data.code === DATA_CODE.get('SUCCESS')) {
        return resolve(res.data.data);
      }

      // 请求错误
      const d = {
        ...res.data,
        err: (res.data && res.data.message) || `服务器开小差，请稍后再试～`,
      };

      // 配置项：是否显示错误提示
      if (config && config.showErrTip) {
        Tips.loaded();
        if ((config.tipType && config.tipType === 2) || d.err.length > 15) {
          Taro.showModal({
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

  static get(url: string, data: any, config?: Config) {
    return this.http({url, data, method: "GET", config});
  }

  static post(url: string, data: any, config?: Config) {
    return this.http({url, data, method: "POST", config});
  }

  /**
   *
   * @static 登陆
   * @returns  promise
   * @memberof Request
   */
  static login(url) {
    if (!this.isLogining) {
      this.loginReadyPromise = this.onLogining(url);
    }
    return this.loginReadyPromise;
  }

  static loginTips(reject) {
    reject();
    this.isLogining = false;
    const url = getRouterUrlWithArgs();
    Taro.hideLoading();
    return Taro.showModal({
      title: "提示",
      content: "登录后，才可以进行后续操作哦～",
      confirmText: "去登录",
      confirmColor: "#ff440a",
      showCancel: false,
      success: () =>
        Taro.redirectTo({
          url: `/pages/login/index?prevRouter=${encodeURIComponent(
            url
          )}`,
        }),
    });
  }

  static onLogining(url) {
    this.isLogining = true;
    return new Promise(async (_, reject) => {
      // 获取code
      const { code } = await Taro.login();

      const loginParams = Taro.getStorageSync("login");
      const userInfo = Taro.getStorageSync("userInfo");

      if (url === 'login') {
        return this.loginTips(reject);
      }

      // 未登录
      if (!(userInfo.userId)) {
        return this.loginTips(reject)
      }

      const res = await Taro.request({
        method: "POST",
        url: `${MAINHOST[0]}${Api.user_post_login}`,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          ...loginParams,
          weixinCode: code,
        },
      });

      if (!res.data.success) {
        return this.loginTips(reject);
      } else {
        Taro.setStorageSync("token", res.data.authorityToken);
        Taro.setStorageSync("userInfo", { ...res.data });
      }

    })
  }
}

export default Request;
