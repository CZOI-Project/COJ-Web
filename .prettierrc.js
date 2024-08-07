// .prettierrc.js
module.exports = {
  // 行尾使用分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 换行宽度，即一行最多多少个字符
  printWidth: 200,
  // 缩进使用空格数量
  tabWidth: 2,
  // 使用空格而非 Tab 缩进
  useTabs: false,
  // 在对象字面量的尾部使用逗号
  trailingComma: "all",
  // 箭头函数参数括号风格，避免不必要的括号
  arrowParens: "avoid",
  // 换行符风格，auto 会根据操作系统选择
  endOfLine: "auto",
  // JSX 中是否使用单引号
  jsxSingleQuote: false,
  // JSX 的 > 是否在同一行
  jsxBracketSameLine: false,
  // 允许忽略哪些语言的格式化，例如 Vue
  // disableLanguages: ['vue'],
  // 允许覆盖某些文件的配置
  // overrides: [
  //   {
  //     files: '*.json',
  //     options: {
  //       printWidth: 80,
  //       tabWidth: 2,
  //       semi: false,
  //       singleQuote: false,
  //       trailingComma: 'none',
  //       arrowParens: 'always'
  //     }
  //   }
  // ]
};
