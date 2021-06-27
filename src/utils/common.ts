import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import Tips from "./tips";

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

/**
 * 遍历tree结构 数据
 * @param {array} val
 * @returns {array}
 */
export function changeTree(val = []) {
  val.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      changeTree(item.children);
    }
  });
  return val;
}

/**
 * 格式化时间
 * @param date
 * @returns {string}
 */
export function formatTime(date: dayjs.ConfigType | Date | string | number, fmtType = "YYYY-MM-DD HH:mm:ss") {
  return date ? dayjs(date).format(fmtType) : "";
}

/**
 * 截取url文件名
 * @param url
 *
 */
export function getFileName(url = "") {
  let string = url.substring(url.lastIndexOf("/") + 1);
  return string;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element: HTMLElement, className: string) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * 判断数组内容的某个值是否连续
 * @param {array} arr
 * @param {string} key 要判断的键
 * @returns {boolean}
 */
export function isContinuous(arr = [], key = "id") {
  return arr.every((item, index, array) => {
    if (index !== array.length - 1) {
      return item[key] + 1 === array[index + 1][key];
    }
    return true;
  });
}
