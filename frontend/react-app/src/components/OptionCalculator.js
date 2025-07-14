import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
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

const OptionCalculator = () => {
  // 表单状态
  const [formData, setFormData] = useState({
    is_call: true,
    spot_price: '', // 标的当前市场价格
    strike_price: '', // 执行价格
    time_to_maturity: '', // 到期时间
    risk_free_rate: '', // 无风险利率
    volatility: '' // 波动率
  });

  // 结果状态
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 处理期权类型变化
  const handleRadioChange = (e) => {
    console.log(e.target.value);
    setFormData({
      ...formData,
      is_call: e.target.value === 'call'
    });
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      // 转换表单数据为API所需格式
      const apiData = {
        is_call: formData.is_call,
        spot_price: parseFloat(formData.spot_price),
        strike_price: parseFloat(formData.strike_price),
        time_to_maturity: parseFloat(formData.time_to_maturity),
        risk_free_rate: parseFloat(formData.risk_free_rate),
        volatility: parseFloat(formData.volatility)
      };

      // 发送API请求
      const response = await axios.post('/api/price', apiData);
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        '计算期权价格时发生错误，请检查输入并重试。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ borderRadius: 4, width: 600 }} elevation={5}>
      <CardContent>
        <FormControl component="fieldset" sx={{border: 2, width: "100%"}}>
            <FormLabel id="option-type" sx={{ fontWeight: 800, fontSize: 20, color: '#3F3F3F' }}>
              期权类型
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="option-type-radio-buttons-group-label"
              name="option-type-radio-buttons-group"
              onChange={handleRadioChange}
              sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}
            >
              <FormControlLabel value="call" control={<Radio />} label="看涨期权(Call)" />
              <FormControlLabel value="put" control={<Radio />} label="看跌期权(Put)" />
            </RadioGroup>

            <FormLabel id="price-setting" sx={{ fontWeight: 800, fontSize: 20, color: '#3F3F3F' }}>
              相关价格设置
            </FormLabel>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: 2, 
              marginTop: 1,
              justifyContent: 'space-between' 
              }}>
              <TextField 
                error={formData.spot_price === ''}
                id="spot-price" 
                label="标的当前价格" 
                variant="outlined"
                helperText="保留小数点后两位"
                sx={{ width: '45%' }}
                />
              <TextField 
              error={formData.strike_price === ''}
              id="strike-price" 
              label="行权价格" 
              variant="outlined"
              helperText="保留小数点后两位"
              sx={{ width: '45%' }}
               />
            </Box>

            <FormLabel id="other-setting" sx={{ fontWeight: 800, fontSize: 20, color: '#3F3F3F' }}>
              其他相关系数设置
            </FormLabel>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: 2, 
              marginTop: 1,
              justifyContent: 'space-between' 
              }}>
              <TextField 
                error={formData.spot_price === ''}
                id="spot-price" 
                label="波动率" 
                variant="outlined"
                helperText="保留小数点后两位"
                sx={{ width: '45%' }}
                />
              <TextField 
              error={formData.strike_price === ''}
              id="strike-price" 
              label="无风险利率" 
              variant="outlined"
              helperText="保留小数点后两位"
              sx={{ width: '45%' }}
               />
            </Box>
            
          </FormControl>
      </CardContent>
      <CardActions sx={{ 
        display: 'flex',
        width: '100%', 
        justifyContent: 'center' 
        }}>
        <Button 
        variant="contained" 
        startIcon={<SendIcon />} 
        sx={{
          width: "50%"
        }}
        >
          计算
        </Button>
      </CardActions>
    </Card>

      {/* 显示结果或错误 */}
      {result && <ResultDisplay result={result} />}
      
      {error && (
        <Alert variant="danger">
          <Alert.Heading>错误</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
    </>
  );
};

export default OptionCalculator;