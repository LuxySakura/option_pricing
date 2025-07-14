#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
测试虚拟环境是否正常工作的脚本
"""

import sys
import platform


def main():
    """打印Python环境信息"""
    print("\n===== Python虚拟环境测试 =====")
    print(f"Python版本: {sys.version}")
    print(f"Python路径: {sys.executable}")
    print(f"操作系统: {platform.system()} {platform.release()}")
    
    # 检查是否在虚拟环境中
    in_venv = hasattr(sys, 'real_prefix') or \
              (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)
    
    if in_venv:
        print("\n✅ 当前在Python虚拟环境中运行")
        print(f"虚拟环境路径: {sys.prefix}")
    else:
        print("\n❌ 当前不在Python虚拟环境中运行")
        print("请先激活虚拟环境，然后再运行此脚本")
    
    # 尝试导入项目依赖
    try:
        import fastapi
        import numpy
        import scipy
        print("\n依赖检查:")
        print(f"✅ FastAPI版本: {fastapi.__version__}")
        print(f"✅ NumPy版本: {numpy.__version__}")
        print(f"✅ SciPy版本: {scipy.__version__}")
    except ImportError as e:
        print(f"\n❌ 依赖导入错误: {e}")
        print("请确保已安装所有依赖: pip install -r requirements.txt")
    
    print("\n===== 测试完成 =====\n")


if __name__ == "__main__":
    main()