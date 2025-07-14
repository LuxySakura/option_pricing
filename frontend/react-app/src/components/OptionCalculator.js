import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import ResultDisplay from './ResultDisplay';

const OptionCalculator = () => {
  // 表单状态
  const [formData, setFormData] = useState({
    is_call: true,
    spot_price: '',
    strike_price: '',
    time_to_maturity: '',
    risk_free_rate: '',
    volatility: ''
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

  // 处理单选按钮变化
  const handleRadioChange = (e) => {
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
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">输入参数</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* 期权类型 */}
            <Form.Group className="mb-3">
              <Form.Label>期权类型</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="call-option"
                  label="看涨期权 (Call)"
                  name="optionType"
                  value="call"
                  checked={formData.is_call}
                  onChange={handleRadioChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  id="put-option"
                  label="看跌期权 (Put)"
                  name="optionType"
                  value="put"
                  checked={!formData.is_call}
                  onChange={handleRadioChange}
                />
              </div>
            </Form.Group>

            {/* 标的资产当前价格 */}
            <Form.Group className="mb-3">
              <Form.Label>标的资产当前价格 (S)</Form.Label>
              <Form.Control
                type="number"
                name="spot_price"
                value={formData.spot_price}
                onChange={handleInputChange}
                step="0.01"
                min="0.01"
                placeholder="例如：100.00"
                required
              />
              <Form.Text className="text-muted">
                当前市场上标的资产的价格，必须大于0
              </Form.Text>
            </Form.Group>

            {/* 行权价格 */}
            <Form.Group className="mb-3">
              <Form.Label>行权价格 (K)</Form.Label>
              <Form.Control
                type="number"
                name="strike_price"
                value={formData.strike_price}
                onChange={handleInputChange}
                step="0.01"
                min="0.01"
                placeholder="例如：95.00"
                required
              />
              <Form.Text className="text-muted">
                期权合约中规定的买入或卖出标的资产的价格，必须大于0
              </Form.Text>
            </Form.Group>

            {/* 到期时间 */}
            <Form.Group className="mb-3">
              <Form.Label>到期时间 (T) (年)</Form.Label>
              <Form.Control
                type="number"
                name="time_to_maturity"
                value={formData.time_to_maturity}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                placeholder="例如：0.5（半年）"
                required
              />
              <Form.Text className="text-muted">
                期权到期前的剩余时间，以年为单位（例如：3个月=0.25年）
              </Form.Text>
            </Form.Group>

            {/* 无风险利率 */}
            <Form.Group className="mb-3">
              <Form.Label>无风险利率 (r)</Form.Label>
              <Form.Control
                type="number"
                name="risk_free_rate"
                value={formData.risk_free_rate}
                onChange={handleInputChange}
                step="0.001"
                placeholder="例如：0.05（5%）"
                required
              />
              <Form.Text className="text-muted">
                与期权期限相匹配的国债利率，例如：5%应输入0.05
              </Form.Text>
            </Form.Group>

            {/* 波动率 */}
            <Form.Group className="mb-3">
              <Form.Label>波动率 (σ)</Form.Label>
              <Form.Control
                type="number"
                name="volatility"
                value={formData.volatility}
                onChange={handleInputChange}
                step="0.01"
                min="0.01"
                placeholder="例如：0.2（20%）"
                required
              />
              <Form.Text className="text-muted">
                标的资产价格的波动程度，例如：20%应输入0.2
              </Form.Text>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? '计算中...' : '计算期权价格'}
            </Button>
          </Form>
        </Card.Body>
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