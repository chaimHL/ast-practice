import parseAttrs from './parseAttrs.js'

export default function(templateStr) {
  // 准备一个指针
  let i = 0
  // 准备两个栈
	// 初始添加元素 { children: [] } 是因为如果不加， stackContent 在遇到最后一个封闭标签进行弹栈后，stackContent 里就没有元素了，也没有 .children 可以去 push 了
  const stackTag = [], stackContent = [{ children: [] }] 
  // 指针所指位置为开头的剩余字符串
  let restTemplateStr = templateStr
  // 识别开始标签的正则
  const regExpStart = /^<([a-z]+[1-6]?)(\s?[^>]*)>/

 while (i < templateStr.length - 1) {
  restTemplateStr = templateStr.substring(i)
  // 遇到开始标签
  if (regExpStart.test(restTemplateStr)) {
    const startTag = restTemplateStr.match(regExpStart)[1] // 标签
    const attrsStr = restTemplateStr.match(regExpStart)[2] // 属性
    // 标签栈进行压栈
    stackTag.push(startTag)
    // 内容栈进行压栈
    stackContent.push({
			tag: startTag,
      attrs: parseAttrs(attrsStr),
      type: 1,
			children: []
		})
    i += startTag.length + attrsStr.length  + 2 // +2 是因为还要算上 < 和 >
  } else if (/^<\/[a-z]+[1-6]?>/.test(restTemplateStr)) { // 遇到结束标签
    const endTag = restTemplateStr.match(/^<\/([a-z]+[1-6]?)>/)[1]
    // 结束标签应该与标签栈的栈顶标签一致
    if (endTag === stackTag[stackTag.length -1]) {
			// 两个栈都进行弹栈
      stackTag.pop()
			const popContent = stackContent.pop()
			stackContent[stackContent.length - 1].children.push(popContent)
      i += endTag.length + 3 // +3 是因为还要算上 </ 和 >
    } else {
      throw Error('标签' + stackTag[stackTag.length -1] + '没有闭合')
    }
  } else if (/^[^<]+<\/[a-z]+[1-6]?>/.test(restTemplateStr)) { // 遇到内容
    const wordStr = restTemplateStr.match(/^([^<]+)<\/[a-z]+[1-6]?>/)[1] // 捕获结束标签 </> 之前的内容，并且不能包括开始标签 <>
    if (!/^\s+$/.test(wordStr)) { // 如果捕获的内容不为空
			// 将内容栈栈顶元素进行赋值
      stackContent[stackContent.length - 1].children.push({
				text: wordStr,
				type: 3
			})
    }
    i += wordStr.length
  } else {
    i++
  }
 }
 // 因为定义 stackContent 的时候就默认添加了一项元素 { children: [] }，现在只要返回 children 的第一项就行 
 return stackContent[0].children[0]
}