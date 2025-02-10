{
 "cells": [
  {
   "cell_type": "markdown",
   "id": "69d4e01c-6eb7-434f-aac3-cb929fef5b47",
   "metadata": {},
   "source": [
    "# Post-Earthquake Building Damage and Fatality Estimation System"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "c4ab620c-cdfd-40b6-a358-fd9111c6a563",
   "metadata": {},
   "source": [
    "## 1、系统功能"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "a62ba3ab-21a5-4b6a-b4f9-c05c4388272d",
   "metadata": {},
   "source": [
    "Post-Earthquake Building Damage and Fatality Estimation System (Ebdfes)能够实时捕捉最新的地震事件，并自动触发房屋损害与死亡人数的评估，提供房屋损害和死亡人数的概率分布及空间分布，帮助及时评估灾后影响。"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "70425624-4fbd-408c-9194-9aa245ab4b38",
   "metadata": {},
   "source": [
    "## 2、所需环境"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "5ec5e365-6b77-4e3a-84cb-04c106522bea",
   "metadata": {},
   "source": [
    "Ebdfes支持在Windows中的部署，后端程序通过Python完成，分析结果存储在MySQL和API，最终完成前端的交互展示。用户也可以通过自定义保存路径，将分析结果存储在本地文件中，详细见/example/Example_Estimation.py.\n",
    "后端程序分析所需要在Python3.11及以上的环境中运行，依赖的包（Packge）至少有：requests, json, apscheduler, pandas, os, numpy, scipy, math, random, threading, queue, global, warnings. 如果希望将分析结果存储在MySQL中，还需要相关支持MySQL数据库包pymysql，dbutils。 API和前端所需要的环境，可以在\\api和\\frontend中看到。\n",
    "\n",
    "Ebdfes 支持在 Windows 系统中部署，后端程序使用 Python 实现，分析结果存储于 MySQL 数据库和 API 中，并最终呈现于前端交互展示。用户还可以通过自定义保存路径，将分析结果保存在本地文件中，具体操作请查看 /example/Example_Estimation.py。\n",
    "后端程序分析需在 Python 3.11 及以上版本的环境中运行，依赖的Python 库包括：requests、json、apscheduler、pandas、os、numpy、scipy、math、random、threading、queue、global 和 warnings。如果希望将分析结果存储至 MySQL 数据库，还需要额外安装支持 MySQL 的相关包，如 pymysql 和 dbutils。API 接口所需的环境配置可在 /code/Main.py 中找到。\n"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "630c19d1-2a5c-4cf9-b4d4-7a81fc7853e2",
   "metadata": {},
   "source": [
    "## 3、基本文件"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "54beef6f-24e5-4190-be92-09a69534941b",
   "metadata": {},
   "source": [
    "基本数据包括感兴趣位置点的信息、风险暴露数据、易损性模型等。这些基本数据需要由用户自行定义和准备，因为它们直接与用户的关注点、兴趣或相关利益相关。我们提供了可加载的基本数据示例，包括 location_data、vc_model、exposure_data 和 station_data（可选），这些示例可以在目录 /exposure_data 中找到。\n",
    "\n"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "5c9d09f6-a654-449d-8bdb-c42ab0953d75",
   "metadata": {},
   "source": [
    "## 4、使用方法"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "fe1dfd34-fc7a-4c44-a3e7-2455d298daee",
   "metadata": {},
   "source": [
    "系统后端程序经过高度集成化，/Code/Main.py 能够完成后端分析程序的全部功能，实现自动运行。程序会持续监测是否有新的地震发生，用户可以通过调整 sched.add_job 中的 minutes 参数来设置捕捉地震的时间间隔，以在时效性和计算消耗之间找到平衡。图 1 显示了时间间隔为 0.1分钟时的打印窗口返回结果。为了避免重复捕捉同一次地震事件，系统在 MySQL 中创建了数据表，相关样例表可以在 \\mysql_table 中找到。用户可以在设置正确的MySQL 连接后，可以直接执行Code/Main.py 部署。\n",
    "\n",
    "对于单次地震事件结果的评估，可以在设置地震震源参数后，通过直接运行/example/Example_Estimation.py.实现。在Example_Estimation.py中，以2024年能登半岛地震为例，进行了参数预设值，用户可以运行该程序开始分析。在打印窗口，会提示程序的执行进度，如图X所示。在用户甚至可以假设一次地震，评估这次地震事件对感兴趣暴露点的影响。\n",
    "\n",
    "系统后端程序经过高度集成， /Code/Main.py 可以实现后端分析程序的全部功能，自动运行并持续监测是否有新的地震发生。用户可以通过调整 sched.add_job 中的 minutes 参数来设置捕捉地震的时间间隔，以在时效性和计算消耗之间找到平衡。图 X 显示了时间间隔为 0.1 分钟时的打印窗口返回结果。为了避免重复捕捉同一次地震事件，系统在 MySQL 中创建了数据表，相关样例表可以在 /mysql_table 中找到。用户在设置正确的 MySQL 连接后，可以直接执行 Code/Main.py 完成部署。\n",
    "对于单次地震事件的评估，用户只需设置地震震源参数，并通过运行 /example/Example_Estimation.py 即可开始分析。以 2024 年能登半岛地震为例，Example_Estimation.py 中提供了参数的预设值，用户可以直接运行该程序进行分析。打印窗口将显示程序的执行进度，如图 2 所示。用户还可以假设某次地震，评估其对感兴趣暴露点的影响。\n"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "918b6204-b698-4f19-81e6-67e4d2e727f5",
   "metadata": {},
   "source": [
    "## 5、API和前端"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "cd94180b-3673-4a34-a7df-88208a71498a",
   "metadata": {},
   "source": [
    "API 和前端界面将帮助用户更直观地了解地震后果。我们将提供相关的 API 程序和前端程序供用户下载和部署，具体内容可在 XX 中找到。"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "ea703631-8917-4c5f-bdb6-358e5053d490",
   "metadata": {},
   "source": [
    "## 6、支持文献"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "a89bed32-7585-4c35-898f-87670e9f391a",
   "metadata": {},
   "source": [
    "+ [1]\tZHAO D, WANG Z, WANG J, et al. A Rapid Estimation Method for Post-earthquake Building Losses [J]. International Journal of Disaster Risk Science, 2023: 1-12.\n",
    "+ [2]\tWANG Z, ZHAO D, WANG J, et al. Application of an integrated earthquake loss estimation method in 2024 Hualien Mw7. 4 earthquake [J] Natural Hazards. 2025: 1-25.\n",
    "+ [3]\tZhao D, Wang Z, Liu Y, et al. Seismic loss uncertainty analysis based on actual seismic data from New Zealand [J]. Earthquake Engineering and Engineering Dynamics, 2021, 41(02): 84-95.\n",
    "+ [4]\tZhou Y, Wang Z, Shi L et al. Spatial correlation of earthquake loss and its impact on earthquake loss distribution estimation [J]. World Earthquake Engineering, 2022, 38(02): 151-9.\n",
    "+ [5]\tZhao D, Wang Z, Li Z, et al. Luding Ms6.8 Earthquake Rapid Assessment of Building Losses [J]. World Earthquake Engineering, 2023, 39(2).\n"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "50e5d814-6ff7-40af-bbd2-d17e1c130bd2",
   "metadata": {},
   "source": [
    "## 7、联系方式"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "3d32f8ce-dbab-43b3-92af-eec48c7a7aed",
   "metadata": {},
   "source": [
    "zifa@iem.ac.cn <P>\n",
    "denco666@163.com<P>\n",
    "siranyang111@gmail.com\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "b1083c76-a9a1-4224-a8b1-234ca8e17b95",
   "metadata": {},
   "outputs": [],
   "source": []
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "3f0d876d-1ce7-4c53-ad46-08b19b2b7d06",
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.12.7"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
