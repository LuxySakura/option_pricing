import pytest
import numpy as np
from fastapi.testclient import TestClient
from app.main import black_scholes_price, app

# 初始化测试客户端
client = TestClient(app)


# 正常测试：测试看涨期权定价
def test_call_option_pricing():
    """测试看涨期权定价"""
    # 标准测试用例
    price = black_scholes_price(
        is_call=True,
        S=100.0,  # 标的资产当前价格
        K=105.0,  # 行权价格
        T=1,  # 到期时间（年）
        r=0.05,  # 无风险利率
        sigma=0.2,  # 波动率
        q=0,  # 年化连续股息率
    )
    # 使用近似值进行比较，因为不同实现可能有微小差异
    assert round(price, 2) == 8.02, f"看涨期权价格计算错误: {price}"


# 正常测试：测试看跌期权定价
def test_put_option_pricing():
    """测试看跌期权定价"""
    # 标准测试用例
    price = black_scholes_price(
        is_call=False,
        S=100.0,  # 标的资产当前价格
        K=95.0,  # 行权价格
        T=1,  # 到期时间（年）
        r=0.05,  # 无风险利率
        sigma=0.2,  # 波动率
        q=0,  # 年化连续股息率
    )
    # 使用近似值进行比较
    assert round(price, 2) == 3.71, f"看跌期权价格计算错误: {price}"

# 边界测试：到期时间 == 0
def test_zero_time_to_maturity():
    """测试到期时间为0的情况"""
    # 看涨期权，到期时间为0，期权价格应该等于内在价值
    price = black_scholes_price(
        is_call=True,
        S=100.0,  # 标的资产当前价格
        K=95.0,  # 行权价格
        T=0.0,  # 到期时间（年）
        r=0.05,  # 无风险利率
        sigma=0.2,  # 波动率
        q=0,  # 年化连续股息率
    )
    assert price == 5.0, "到期时间为0的看涨期权价格应等于内在价值"

    # 看跌期权，到期时间为0，期权价格应该等于内在价值
    price = black_scholes_price(
        is_call=False,
        S=95.0,  # 标的资产当前价格
        K=100.0,  # 行权价格
        T=0.0,  # 到期时间（年）
        r=0.05,  # 无风险利率
        sigma=0.2,  # 波动率
        q=0,  # 年化连续股息率
    )
    assert price == 5.0, "到期时间为0的看跌期权价格应等于内在价值"


# 异常测试：现货价格 <= 0
def test_zero_spot_price():
    """测试现货价格<=0的情况"""
    response = client.post(
        "/api/price",
        json={
            "is_call": False,
            "spot_price": 0.0,
            "strike_price": 100.0,
            "time_to_maturity": 1.0,
            "risk_free_rate": 0.05,
            "volatility": 0.2,
            "q": 0.0,
        },
    )
    # 断言HTTP状态码为400
    assert response.status_code == 400

    data = response.json()
    # 断言响应体中包含了正确的错误信息
    assert (
        data["detail"]
        == "输入数据校验失败: 参数 '标的当前价格' 无效: 输入值必须大于 0.0"
    )

    response = client.post(
        "/api/price",
        json={
            "is_call": True,
            "spot_price": 0.0,
            "strike_price": 100.0,
            "time_to_maturity": 1.0,
            "risk_free_rate": 0.05,
            "volatility": 0.2,
            "q": 0.0,
        },
    )
    # 断言HTTP状态码为400
    assert response.status_code == 400

    data = response.json()
    # 断言响应体中包含了正确的错误信息
    assert (
        data["detail"]
        == "输入数据校验失败: 参数 '标的当前价格' 无效: 输入值必须大于 0.0"
    )


# 异常测试：行权价格 <= 0
def test_zero_strike_price():
    """测试行权价格<=0的情况"""
    response = client.post(
        "/api/price",
        json={
            "is_call": False,
            "spot_price": 100.0,
            "strike_price": 0.0,
            "time_to_maturity": 1.0,
            "risk_free_rate": 0.05,
            "volatility": 0.2,
            "q": 0.0,
        },
    )
    # 断言HTTP状态码为400
    assert response.status_code == 400

    data = response.json()
    # 断言响应体中包含了正确的错误信息
    assert (
        data["detail"] == "输入数据校验失败: 参数 '行权价格' 无效: 输入值必须大于 0.0"
    )

    response = client.post(
        "/api/price",
        json={
            "is_call": True,
            "spot_price": 100.0,
            "strike_price": 0.0,
            "time_to_maturity": 1.0,
            "risk_free_rate": 0.05,
            "volatility": 0.2,
            "q": 0.0,
        },
    )
    # 断言HTTP状态码为400
    assert response.status_code == 400

    data = response.json()
    # 断言响应体中包含了正确的错误信息
    assert (
        data["detail"] == "输入数据校验失败: 参数 '行权价格' 无效: 输入值必须大于 0.0"
    )


# 异常测试：波动率 <= 0
def test_zero_volatility():
    """测试波动率<=0的情况"""
    response = client.post(
        "/api/price",
        json={
            "is_call": False,
            "spot_price": 100.0,
            "strike_price": 95.0,
            "time_to_maturity": 1.0,
            "risk_free_rate": 0.05,
            "volatility": 0.0,
            "q": 0.0,
        },
    )
    # 断言HTTP状态码为400
    assert response.status_code == 400

    data = response.json()
    # 断言响应体中包含了正确的错误信息
    assert data["detail"] == "输入数据校验失败: 参数 '波动率' 无效: 输入值必须大于 0.0"


# 异常测试：到期时间 < 0
def test_neg_time_to_maturity():
    """测试到期时间<0的情况"""
    response = client.post(
        "/api/price",
        json={
            "is_call": False,
            "spot_price": 100.0,
            "strike_price": 95.0,
            "time_to_maturity": -1.0,
            "risk_free_rate": 0.05,
            "volatility": 0.2,
            "q": 0.0,
        },
    )
    # 断言HTTP状态码为400
    assert response.status_code == 400

    data = response.json()
    # 断言响应体中包含了正确的错误信息
    assert (
        data["detail"]
        == "输入数据校验失败: 参数 '到期时间' 无效: 输入值必须大于或等于 0.0"
    )
