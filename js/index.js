import parse from './parse.js'
const templateStr = `<div>
  <h3 id="legend" class="jay song">范特西</h3>
  <ul>
    <li>七里香</li>
  </ul> 
</div>`

const ast = parse(templateStr)
console.log(ast)
