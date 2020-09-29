/** 判断是否存在中文 */
export let isChn = (str: string) => /^[\u4E00-\u9FA5]+$/.test(str)

/** 字符串第一个大写转小写 */
export let firstCapitalizeTurnSmall = (str: string) => {
  let newStr: string = "";
  for (var i = 0; i < str.length; i++) {
    if (i === 0) {
      newStr += str[i][0].toLowerCase()
    } else {
      newStr += str[i]
    }
  }
  return newStr
}

/** 英文转驼峰 */
export let smallTurnHump = (str: string) => {
  let reg = new RegExp("(/)" + "(.)", "g")
  // 空格后面的第一个字符转成大写
  str = str.replace(reg, function (a, b, c) {
    return b + c.toUpperCase();
  })
  // 去除其它的特殊字符
  let res = /[^\u4e00-\u9fa5a-zA-Z0-9]/g
  str = str.replace(res, "")
  // 第一个字符转小写
  str = firstCapitalizeTurnSmall(str)
  return str
}

/** 去除其它的特殊字符 */
export let stringConversion = (str: string) => {
  let res = /[^\u4e00-\u9fa5a-zA-Z0-9]/g
  str = str.replace(res, "")
  return str
}