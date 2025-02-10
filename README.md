# Post-Earthquake Building Damage and Fatality Estimation System (Ebdfes)

## 1. 系统功能
Ebdfes 是一个实时地震灾害评估系统，能够自动触发房屋损害和死亡人数的评估，提供概率分布和空间分布结果，帮助快速评估灾后影响。

## 2. 环境要求
- **操作系统**：Windows
- **Python**：3.11 及以上版本
- **依赖库**：requests, json, apscheduler, pandas, numpy, scipy, math, random, threading, queue, warnings
- **数据库**：MySQL（需安装 pymysql 和 dbutils）
- **前端与API**：详见 `/api` 和 `/frontend` 目录
- **本地存储**：可通过 `/example/Example_Estimation.py` 自定义路径保存分析结果

## 3. 基本文件
用户需自行准备以下基础数据：
- 感兴趣位置点信息
- 风险暴露数据
- 易损性模型

示例数据可在 `/exposure_data` 目录中找到。

## 4. 使用方法

### 4.1 自动运行
- **主程序**：`/Code/Main.py`
- **功能**：持续监测地震事件，自动触发分析
- **设置时间间隔**：通过调整 `sched.add_job` 中的 `minutes` 参数，平衡时效性和计算消耗
- **避免重复捕捉**：系统会在 MySQL 中创建数据表，避免重复处理同一地震事件
- **部署**：配置正确的 MySQL 连接后，直接运行 `Code/Main.py`

### 4.2 单次地震评估
- **脚本**：`/example/Example_Estimation.py`
- **功能**：设置地震震源参数后，运行脚本进行评估
- **示例**：2024 年能登半岛地震的参数预设值
- **运行**：直接运行该脚本，打印窗口显示执行进度

## 5. API 和前端
- **功能**：提供直观的地震后果展示
- **部署**：相关程序可在 `/api` 和 `/frontend` 目录中找到

## 6. 支持文献
- [1] ZHAO D, WANG Z, WANG J, et al. A Rapid Estimation Method for Post-earthquake Building Losses [J]. International Journal of Disaster Risk Science, 2023: 1-12.
- [2] WANG Z, ZHAO D, WANG J, et al. Application of an integrated earthquake loss estimation method in 2024 Hualien Mw7.4 earthquake [J] Natural Hazards. 2025: 1-25.
- [3] Zhao D, Wang Z, Liu Y, et al. Seismic loss uncertainty analysis based on actual seismic data from New Zealand [J]. Earthquake Engineering and Engineering Dynamics, 2021, 41(02): 84-95.
- [4] Zhou Y, Wang Z, Shi L et al. Spatial correlation of earthquake loss and its impact on earthquake loss distribution estimation [J]. World Earthquake Engineering, 2022, 38(02): 151-9.
- [5] Zhao D, Wang Z, Li Z, et al. Luding Ms6.8 Earthquake Rapid Assessment of Building Losses [J]. World Earthquake Engineering, 2023, 39(2).

## 7. 联系方式
- zifa@iem.ac.cn
- denco666@163.com
- siranyang111@gmail.com
