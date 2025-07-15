const TRADING_DAYS = 252; // 每年平均交易日

export const time = [
  {
    value: 'month',
    label: '月',
  },
  {
    value: 'day',
    label: '日',
  },
  {
    value: 'year',
    label: '年',
  }
];

export const timeUnitTransfer = (rawTime, _timeUnit) => {
  // 首先将用户提交的时间统一转换为以年为单位的值
  const raw_time = parseFloat(rawTime);
  let res = 0.0
  // 获取用户提交的时间单位
  // 第一个匹配项后就立即停止遍历，并只返回那一个元素，提高性能
  const _unit = (time.find(unit => unit.label === _timeUnit)).value;

  // 计算不同单位下的转换
  if (_unit === 'month') {
    res = raw_time / 12;
  } else if (_unit === 'day') {
    // 按照交易日统计
    res = raw_time / TRADING_DAYS;
  } else {
    res = raw_time;
  }
  return res
}