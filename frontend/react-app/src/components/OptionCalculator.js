import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import ResultDisplay from './ResultDisplay';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';

const time = [
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

const TRADING_DAYS = 252; // 每年平均交易日

const OptionCalculator = () => {
  // 表单状态
  const [formData, setFormData] = useState({
    is_call: true,
    spot_price: '', // 标的当前市场价格
    strike_price: '', // 执行价格
    time_to_maturity: '', // 到期时间
    risk_free_interest: '', // 无风险利率
    volatility: '', // 波动率
    q: '', // 股息率
  });

  const [formTimeUnit, setFormTimeUnit] = useState('年');

  const [formError, setFormError] = useState({
    spot_price: '',
    strike_price: '',
    time_to_maturity: '',
    risk_free_interest: '',
    volatility: '',
    q: '',
  });

  // 结果状态
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 处理时间单位的变化
  const handleTimeUnitChange = (event) => {
    setFormTimeUnit(event.target.value);
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 验证单个字段是否符合规范的函数
    const validateField = (name, value) => {
      if (value === '') {
        return '此字段不能为空';
      }

      // 对特定字段使用正则表达式验证
      if (name === 'spot_price' || name === 'strike_price') {
        // 正则表达式匹配：整数 或 小数点后不超过两位的数字
        const pattern = /^\d+(\.\d{1,2})?$/;

        if (!pattern.test(value)) {
          // 在这里可以进一步判断是“非数字”还是“位数过多”
          if (isNaN(Number(value))) {
            return '请输入有效的数字';
          } else {
            return '小数点后不能超过两位';
          }
        }
      } else if (name === 'time_to_maturity') {
        const integerRegex = /^-?\d+$/;
        if (!integerRegex.test(value)) {
          // 在这里可以进一步判断是“非数字”还是“小数”
          if (isNaN(Number(value))) {
            return '请输入有效的数字！';
          } else {
            return '请输入整数！';
          }
        }

      } else {
        // 对其他字段只进行基础的数字验证
        if (isNaN(Number(value))) {
          return '请输入有效的数字';
        }
      }
    };

    // 根据name更新表单数据的渲染
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // 实时验证当前修改的字段
    setFormError(prevErrors => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  // 处理期权类型变化
  const handleRadioChange = (e) => {
    console.log(e.target.value);
    setFormData({
      ...formData,
      is_call: e.target.value
    });
  };

  // TODO 处理表单提交
  const handleSubmit = async (e) => {
    console.log("User Submit")
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      // 首先将用户提交的时间统一转换为以年为单位的值
      const raw_time_to_maturity = parseFloat(formData.time_to_maturity);
      // 获取用户提交的时间单位
      // 第一个匹配项后就立即停止遍历，并只返回那一个元素，提高性能
      const timeUnit = (time.find(unit => unit.label === formTimeUnit)).value;
      let final_time_to_maturity = 0.0
      // 计算不同单位下的转换
      if (timeUnit === 'month') {
        final_time_to_maturity = raw_time_to_maturity / 12;
      } else if (timeUnit === 'day') {
        // 按照交易日统计
        final_time_to_maturity = raw_time_to_maturity / TRADING_DAYS;
      } else {
        final_time_to_maturity = raw_time_to_maturity;
      }

      // 转换表单数据为API所需格式
      console.log("user submit form data, current time Unit:", timeUnit, final_time_to_maturity);
      const apiData = {
        is_call: formData.is_call,
        spot_price: parseFloat(formData.spot_price),
        strike_price: parseFloat(formData.strike_price),
        time_to_maturity: final_time_to_maturity,
        risk_free_rate: parseFloat(formData.risk_free_interest)/100,
        volatility: parseFloat(formData.volatility)/100,
        q: parseFloat(formData.q)/100,
      };
      console.log(apiData)

      // 发送API请求
      const response = await axios.post('/api/price', apiData);
      console.log(response)
      setResult(response.data);
    } catch (err) {
      // 确保错误信息是字符串
      setError(
        typeof err.response?.data?.detail === 'string' 
          ? err.response.data.detail
          : '计算期权价格时发生错误，请检查输入并重试。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ borderRadius: 4, width: 600, height: 525 }} elevation={5}
      >
        <CardContent>
          <FormControl component="fieldset" sx={{ width: "100%"}}>
              <FormLabel id="option-type" sx={{ fontWeight: 800, fontSize: 20, color: '#3F3F3F' }}>
                期权类型
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="option-type-radio-buttons-group-label"
                name="is_call"
                value={formData.is_call}
                onChange={handleRadioChange}
                sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between' }}
              >
                <FormControlLabel value={true} control={<Radio />} label="看涨期权(Call)" />
                <FormControlLabel value={false} control={<Radio />} label="看跌期权(Put)" />
              </RadioGroup>

              <Typography id="price-setting" sx={{ fontWeight: 800, fontSize: 20, color: '#3F3F3F' }}>
                相关价格设置
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 1, 
                marginTop: 1,
                justifyContent: 'space-between' 
                }}>
                <TextField 
                  required
                  error={!!formError.spot_price} // 使用 !! 将错误消息（字符串）转换为布尔值
                  id="spot-price"
                  name='spot_price'
                  label="标的当前价格" 
                  variant="outlined"
                  value={formData.spot_price}
                  helperText={formError.spot_price || "小数点后保留两位，例如: 0.02"}
                  sx={{ width: '45%' }}
                  onChange={handleInputChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment
                          position="start"
                        >
                          ￥
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField 
                  required
                  error={!!formError.strike_price}
                  id="strike-price"
                  name='strike_price' 
                  label="行权价格" 
                  variant="outlined"
                  value={formData.strike_price}
                  helperText={formError.strike_price || "小数点后保留两位，例如: 0.02"}
                  sx={{ width: '45%' }}
                  onChange={handleInputChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment
                          position="start"
                        >
                          ￥
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Typography id="time-setting" sx={{ fontWeight: 800, fontSize: 20, color: '#3F3F3F' }}>
                剩余到期时间
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 1, 
                marginTop: 1,
                justifyContent: 'space-between' 
                }}>
                <TextField 
                  required
                  error={!!formError.time_to_maturity}
                  id="time-to-maturity"
                  name='time_to_maturity'
                  label="期权剩余到期时间" 
                  variant="outlined"
                  value={formData.time_to_maturity}
                  helperText={formError.time_to_maturity || "期权剩余到期时间（整数，右侧可调整单位）"}
                  sx={{ width: '100%' }}
                  onChange={handleInputChange}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                        >
                          <Select
                            value={formTimeUnit}
                            onChange={handleTimeUnitChange}
                            // 1. 使用 standard 变体，没有外边框
                            variant="standard" 
                            // 2. 移除下划线，实现无缝集成
                            disableUnderline 
                            aria-label="选择时间单位"
                          >
                            {time.map((option) => (
                              <MenuItem key={option.value} value={option.label}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </InputAdornment>
                      ),
                    },
                  }}/>
              </Box>

              <Typography id="other-setting" sx={{ fontWeight: 800, fontSize: 20, color: '#3F3F3F' }}>
                其他相关系数设置
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 1, 
                marginTop: 1,
                justifyContent: 'space-between' 
                }}>
                <TextField 
                  required
                  error={!!formError.volatility}
                  id="volatility"
                  name='volatility'
                  label="波动率" 
                  variant="outlined"
                  value={formData.volatility}
                  helperText={formError.volatility || "标的波动率"}
                  sx={{ width: '30%' }}
                  onChange={handleInputChange}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                        >
                          %
                        </InputAdornment>
                      ),
                    },
                  }}
                  />
                <TextField 
                  required
                  error={!!formError.risk_free_interest}
                  id="risk-free-interest"
                  name='risk_free_interest'
                  label="无风险利率" 
                  variant="outlined"
                  value={formData.risk_free_interest}
                  helperText={formError.risk_free_interest || "当前无风险利率"}
                  sx={{ width: '30%' }}
                  onChange={handleInputChange}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                        >
                          %
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField 
                  required
                  error={!!formError.q}
                  id="q"
                  name='q'
                  label="股息率" 
                  variant="outlined"
                  value={formData.q}
                  helperText={formError.q || "当前股息率"}
                  sx={{ width: '30%' }}
                  onChange={handleInputChange}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                        >
                          %
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </FormControl>
        </CardContent>
        <CardActions sx={{ 
          display: 'flex',
          width: '100%', 
          justifyContent: 'center',
          height: 20 
          }}>
          <Button 
          variant="contained" 
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition='end'
          type="submit"
          sx={{
            width: "50%",
            fontSize: 18
          }}
          >
            计算
          </Button>
        </CardActions>
      </Card>
 
      {/* 显示结果或错误 */}
      {result && (
        <Card sx={{
          mt: 2, 
          borderRadius: 2, 
          width: 600, 
          backgroundColor: '#c1fcf4', 
          height: 120,
          paddingTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
          }} 
          elevation={5}>
          <CardContent>
            <Typography component="div" 
              sx={{
                fontWeight: 800,            // 设置粗体
                textAlign: 'center',        // 居中对齐
                fontSize: 20,
                color: '#3F3F3F',
                mb: 1,                      // margin-bottom: 2 * 8px = 16px
                textTransform: 'uppercase', // 文本大写
                letterSpacing: 2,           // 字符间距
              }} 
            gutterBottom>
              计算结果
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              width: 400
              }}>
              <Typography 
              component="p" 
              sx={{ 
                fontWeight: 800,            // 设置粗体
                textAlign: 'center',        // 居中对齐
                fontSize: 18,  
              }} 
              color="text.secondary">
              期权类型: 
                <Typography 
                component="p" 
                sx={{ 
                  fontWeight: 800,            // 设置粗体
                  textAlign: 'center',        // 居中对齐
                  fontSize: 20,  
                  color: result.option_type === '看涨期权(Call)' ? 'success.main' : 'error.main'
                }}>
                  {result.option_type}
                </Typography>
              </Typography>
              <Typography 
              component="p" 
              sx={{ 
                fontWeight: 800,            // 设置粗体
                textAlign: 'center',        // 居中对齐
                fontSize: 18, 
              }}
              color="text.secondary"
              >
                期权价格
                <Typography 
                  component="p" 
                  sx={{ 
                    fontWeight: 1000,            // 设置粗体
                    textAlign: 'center',        // 居中对齐
                    fontSize: 22,
                    color: '#d776fc'  
                  }} 
                  >
                  ￥{result.option_price.toFixed(2)}
                </Typography>
              </Typography>
            </Box>
            
          </CardContent>
        </Card>
      )}
      
      {error && (
        <Alert sx={{mt: 2, borderRadius: 2, width: 600 }} elevation={5} variant="filled" severity="error">
          {error}
        </Alert>
      )}
    </>
  );
};

export default OptionCalculator;