import pytest
import numpy as np
from app.main import black_scholes_price


def test_call_option_pricing():
    """测试看涨期权定价"""
    # 标准测试用例
    price = black_scholes_price(
        is_call=True,
        S=100.0,  # 标的资产当前价格
        K=95.0,   # 行权价格
        T=0.5,    # 到期时间（年）
        r=0.05,   # 无风险利率
        sigma=0.2 # 波动率
    )
    # 使用近似值进行比较，因为不同实现可能有微小差异
    assert round(price, 2) == 11.69, f"看涨期权价格计算错误: {price}"


def test_put_option_pricing():
    """测试看跌期权定价"""
    # 标准测试用例
    price = black_scholes_price(
        is_call=False,
        S=100.0,  # 标的资产当前价格
        K=95.0,   # 行权价格
        T=0.5,    # 到期时间（年）
        r=0.05,   # 无风险利率
        sigma=0.2 # 波动率
    )
    # 使用近似值进行比较
    assert round(price, 2) == 2.34, f"看跌期权价格计算错误: {price}"


def test_put_call_parity():
    """测试看涨看跌平价关系"""
    # 参数设置
    S = 100.0  # 标的资产当前价格
    K = 95.0   # 行权价格
    T = 0.5    # 到期时间（年）
    r = 0.05   # 无风险利率
    sigma = 0.2 # 波动率
    
    # 计算看涨和看跌期权价格
    call_price = black_scholes_price(True, S, K, T, r, sigma)
    put_price = black_scholes_price(False, S, K, T, r, sigma)
    
    # 根据看涨看跌平价关系: C - P = S - K*e^(-rT)
    left_side = call_price - put_price
    right_side = S - K * np.exp(-r * T)
    
    # 检查平价关系是否成立（允许小误差）
    assert abs(left_side - right_side) < 1e-10, "看涨看跌平价关系不成立"


def test_zero_time_to_maturity():
    """测试到期时间为0的情况"""
    # 看涨期权，到期时间为0，期权价格应该等于内在价值
    price = black_scholes_price(
        is_call=True,
        S=100.0,  # 标的资产当前价格
        K=95.0,   # 行权价格
        T=0.0,    # 到期时间（年）
        r=0.05,   # 无风险利率
        sigma=0.2 # 波动率
    )
    assert price == 5.0, "到期时间为0的看涨期权价格应等于内在价值"
    
    # 看跌期权，到期时间为0，期权价格应该等于内在价值
    price = black_scholes_price(
        is_call=False,
        S=95.0,   # 标的资产当前价格
        K=100.0,  # 行权价格
        T=0.0,    # 到期时间（年）
        r=0.05,   # 无风险利率
        sigma=0.2 # 波动率
    )
    assert price == 5.0, "到期时间为0的看跌期权价格应等于内在价值"


def test_deep_in_the_money_call():
    """测试深度价内的看涨期权"""
    price = black_scholes_price(
        is_call=True,
        S=150.0,  # 标的资产当前价格
        K=100.0,  # 行权价格
        T=0.5,    # 到期时间（年）
        r=0.05,   # 无风险利率
        sigma=0.2 # 波动率
    )
    # 深度价内的看涨期权价格应该接近于S-K*e^(-rT)
    intrinsic_value = 150.0 - 100.0 * np.exp(-0.05 * 0.5)
    assert price > intrinsic_value, "深度价内的看涨期权价格应大于内在价值"


def test_deep_out_of_the_money_call():
    """测试深度价外的看涨期权"""
    price = black_scholes_price(
        is_call=True,
        S=50.0,   # 标的资产当前价格
        K=100.0,  # 行权价格
        T=0.5,    # 到期时间（年）
        r=0.05,   # 无风险利率
        sigma=0.2 # 波动率
    )
    # 深度价外的看涨期权价格应该接近于0，但大于0
    assert price > 0 and price < 1.0, "深度价外的看涨期权价格应接近于0但大于0"