// 首先，从我们的文件中导入需要测试的函数
import { timeUnitTransfer } from './timeUnit.jsx';

// 'describe' 用于将相关的测试组合在一起，形成一个测试套件
describe('timeUnit Format function', () => {

  // 'it' 或 'test' 用于定义一个单独的测试用例
  // 第一个参数是对这个测试用例的描述
  it('should completely equal to 1.0 as Input: 1 Year', () => {
    expect(timeUnitTransfer(1, '年')).toBe(1.0);
  });

  it('should completely equal as Input 1 Year & 12 Month', () => {
    expect(timeUnitTransfer(12, '月')).toBe(timeUnitTransfer(1, '年'));
  });

  it('should completely equal as Input 1 Year & 252 Day', () => {
    expect(timeUnitTransfer(252, '日')).toBe(timeUnitTransfer(1, '年'));
  });

});