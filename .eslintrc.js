module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 函数定义小括号前要不要有空格
    // 第2个参数：always 表示需要有空格，never 不能有空格
    // 第1个参数：error表示检测到不符合规则时会标出错误，0表示不会标出错误
    'space-before-function-paren': [0, 'never'],
    'vue/multi-word-component-names': 0,
    semi: 0
  }
}
