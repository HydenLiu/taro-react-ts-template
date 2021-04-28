import Taro from "@tarojs/taro";
import moment from "moment";
import Tips from "./tips";

/**
 * 校验手机号是否正确
 * @param phone 手机号
 */
export const verifyPhone = (phone) => {
  const reg = /^1[0-9]{10}$/;
  const _phone = phone.toString().trim();
  let toastStr =
    _phone === ""
      ? "手机号不能为空~"
      : !reg.test(_phone) && "请输入正确手机号~";
  return {
    errMsg: toastStr,
    done: !toastStr,
    value: _phone,
  };
};

//手机号中间4位****
export const dispostPhone = (phone) => {
  if (phone) {
    let reg = /^(\d{3})\d*(\d{4})$/;
    let newPhone = `${phone}`.replace(reg, "$1****$2");
    return newPhone;
  }
};

// 身份证脱敏
export const dispostIdCard = (idCard) => {
  if (idCard) {
    return idCard.replace(/^(.{6})(?:\d+)(.{4})$/, "$1****$2");
  }
  return null;
};

// 校验必填
export const verifyStr = (str, text) => {
  const _str = str.toString().trim();
  const toastStr = _str.length ? false : `请填写${text}～`;
  return {
    errMsg: toastStr,
    done: !toastStr,
    value: _str,
  };
};

// 截取字符串
export const sliceStr = (str, sliceLen) => {
  if (!str) {
    return "";
  }
  let realLength = 0;
  const len = str.length;
  let charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
    if (realLength > sliceLen) {
      return `${str.slice(0, i)}...`;
    }
  }

  return str;
};

/**
 * JSON 克隆
 * @param {Object | Json} jsonObj json对象
 * @return {Object | Json} 新的json对象
 */
export function objClone(jsonObj) {
  var buf;
  if (jsonObj instanceof Array) {
    buf = [];
    var i = jsonObj.length;
    while (i--) {
      buf[i] = objClone(jsonObj[i]);
    }
    return buf;
  } else if (jsonObj instanceof Object) {
    buf = {};
    for (var k in jsonObj) {
      buf[k] = objClone(jsonObj[k]);
    }
    return buf;
  } else {
    return jsonObj;
  }
}

// 克隆Map
export function mapClone(mapObj) {
  var newMap;
  if (mapObj instanceof Map) {
    newMap = new Map();
    for (let [key, value] of mapObj.entries()) {
      newMap.set(key, value);
    }
    return newMap;
  } else {
    return mapObj;
  }
}

/**
 * @msg: 返回当前页面路由
 */
export const getRouterUrl = (num = 1) => {
  const pages = Taro.getCurrentPages();

  let url = "";
  if (pages.length >= num) {
    const currentPage = pages[pages.length - num];
    url = currentPage.route;
  } else {
    url === "";
  }

  return url;
};

export const getRouterUrlWithArgs = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  const options = currentPage.options;
  let urlWithArgs = `/${url}?`;
  for (let key in options) {
    const value = options[key];
    urlWithArgs += `${key}=${value}&`;
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
  return urlWithArgs;
};


export const formateObjToParamStr = (data, isPrefix = false) => {
  let prefix = isPrefix ? '?' : ''
  let _result = []
  for (let key in data) {
    let value = data[key]
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      continue
    }
    if (value.constructor === Array) {
      value.forEach(_value => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
      })
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  }

  return _result.length ? prefix + _result.join('&') : ''
}

/**
 * @msg: 压缩图片到指定大小 limitSize：基数
 */
export const compressImg = (imagePath = "", limitSize = 1) => {
  return new Promise((resolve) => {
    Taro.getFileInfo({ filePath: imagePath }).then((res) => {
      const _limitSize = 1024 * 1024 * limitSize;
      console.log(res.size);
      if (res.size > _limitSize) {
        const quality = (_limitSize / res.size) * 100;

        wx.compressImage({
          src: imagePath, // 图片路径
          quality, // 压缩质量
          success: (_res) => resolve(_res.tempFilePath),
          fail: () => resolve(imagePath),
        });
      } else {
        resolve(imagePath);
      }
    });
  });
};

/**
 * @msg: 上传图片
 * @param files 图片数组 Array<{url: string}> 或者 Array<string>
 * @return: {string} 返回一个距离当前时间差的格式化时间
 */
export const uploadImg = (files) => {
  if (!files.length) {
    return Tips.toast("不存在上传的文件");
  }

  const uploadArrPromise = files.map((file) =>
    uploadImgToAliServer(file.url || file)
  );

  // 返回上传的结果 promise数组
  return Promise.all(uploadArrPromise).then((urls) => urls);
};

/**
 * @msg: 数组转Map
 * @param Array<{id: number, name: string}>
 * @return: Map
 */
export const formatMap = (arr = []) => {
  let newMap = new Map();
  arr.forEach((item) => {
    newMap.set(item.id, item.name);
  });
  return newMap;
};

/**
 * 格式化时间
 * @param data
 * @returns {string}
 */
export function formatTime(data, fmtType = "YYYY-MM-DD HH:mm:ss") {
  return data ? moment(data).format(fmtType) : "";
}

/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
export function formatRichText(html = "") {
  let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
    match = match.replace(/style="[^"]+"/gi, "").replace(/style='[^']+'/gi, "");
    match = match.replace(/width="[^"]+"/gi, "").replace(/width='[^']+'/gi, "");
    match = match
      .replace(/height="[^"]+"/gi, "")
      .replace(/height='[^']+'/gi, "");
    return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
    match = match
      .replace(/width:[^;]+;/gi, "max-width:100%;")
      .replace(/width:[^;]+;/gi, "max-width:100%;");
    return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, "");
  newContent = newContent.replace(
    /\<img/gi,
    '<img style="max-width:100%;height:auto;display:block;margin:0;vertical-align: middle;"'
  );
  return newContent;
}

// 图片预览
export const previewImage = (url, current) => {
  const params = { urls: [...url] };
  if (current) {
    params.current = current;
  }
  Taro.previewImage(params);
};

/**
 * 解析url参数
 * @param {*} str xxx=xxx&yyy=yyy
 * @returns {object}
 */
export const parseUrlParams = (str = '') => {
  const obj = {};
  if (!str.trim()) return obj;

  const paramsArr = str.split("&");
  for (let i = 0; i < paramsArr.length; i++) {
    const [key, val] = paramsArr[i].split("=");
    obj[key] = val;
  }

  return obj;
}

export const base64src = (base64data) => {
  return new Promise((resolve, reject) => {
    const fsm = Taro.getFileSystemManager();
    const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
    const buffer = Taro.base64ToArrayBuffer(bodyData);
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath);
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'))
      },
    });
  })
};
