export default function(attrsStr) {
  const attrsStrTrim = attrsStr.trim() // 去空格
  if (attrsStrTrim) {
    let point = 0 // 断点
    let isYinhao = false // 是否是引号
    let result = [] // 结果数组
    for (let index = 0; index < attrsStrTrim.length; index++) {
      if (attrsStrTrim[index] === '"') isYinhao = !isYinhao
      // 遇到空格且不在双引号内，就截取从 point 到此的字符串
      if (!isYinhao && /\s/.test(attrsStrTrim[index])) {
        const attrs = attrsStrTrim.substring(point, index)
        result.push(attrs)
        point = index
      }
    }
    result.push(attrsStrTrim.substring(point + 1)) // 最后一个属性是没有通过 for 循环得到的，所以要专门加上，+1 是为了去除开始的空格
    // ["id="legend"", "class="jay song""]
    result = result.map(item => {
      // 根据等号拆分
      const itemMatch = item.match(/(.+)="(.+)"/)
      return {
        name: itemMatch[1],
        value: itemMatch[2]
      }
    })
    return result
  } else {
    return []
  }
}