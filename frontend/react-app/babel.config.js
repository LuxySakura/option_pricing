// 让 Jest 能够理解现代 JavaScript 和 JSX 语法
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    ['@babel/preset-react', {runtime: 'automatic'}],
  ],
};