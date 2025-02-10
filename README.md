# Post-Earthquake Building Damage and Fatality Estimation System (Ebdfes)

## 1. System Functionality
Ebdfes is a real-time earthquake disaster assessment system that automatically triggers the evaluation of building damage and fatality counts, providing probability distributions and spatial distribution results to help quickly assess post-disaster impacts.

## 2. Environment Requirements
- **Operating System**: Windows
- **Python**: Version 3.11 or higher
- **Dependencies**: requests, json, apscheduler, pandas, numpy, scipy, math, random, threading, queue, warnings
- **Database**: MySQL (pymysql and dbutils packages required)
- **Frontend and API**: See `/api` and `/frontend` directories
- **Local Storage**: Analysis results can be saved to a custom path using `/example/Example_Estimation.py`

## 3. Basic Files
Users need to prepare the following basic data:
- Location data of points of interest
- Exposure data
- Vulnerability models

Example data can be found in the `/exposure_data` directory.

## 4. Usage

### 4.1 Automatic Operation
- **Main Program**: `/Code/Main.py`
- **Function**: Continuously monitors earthquake events and automatically triggers analysis
- **Setting Time Interval**: Adjust the `minutes` parameter in `sched.add_job` to balance timeliness and computational cost
- **Avoiding Duplicate Events**: The system creates a MySQL table to avoid processing the same earthquake event multiple times
- **Deployment**: Configure the MySQL connection and run `Code/Main.py`

### 4.2 Single Earthquake Assessment
- **Script**: `/example/Example_Estimation.py`
- **Function**: Set earthquake source parameters and run the script to perform the assessment
- **Example**: Predefined parameters for the 2024 Noto Peninsula earthquake
- **Execution**: Run the script directly, and the progress will be displayed in the console

## 5. API and Frontend
- **Function**: Provides an intuitive display of earthquake consequences
- **Deployment**: Relevant programs can be found in the `/api` and `/frontend` directories

## 6. Supporting Literature
- [1] ZHAO D, WANG Z, WANG J, et al. A Rapid Estimation Method for Post-earthquake Building Losses [J]. International Journal of Disaster Risk Science, 2023: 1-12.
- [2] WANG Z, ZHAO D, WANG J, et al. Application of an integrated earthquake loss estimation method in the 2024 Hualien Mw7.4 earthquake [J] Natural Hazards. 2025: 1-25.
- [3] Zhao D, Wang Z, Liu Y, et al. Seismic loss uncertainty analysis based on actual seismic data from New Zealand [J]. Earthquake Engineering and Engineering Dynamics, 2021, 41(02): 84-95.
- [4] Zhou Y, Wang Z, Shi L et al. Spatial correlation of earthquake loss and its impact on earthquake loss distribution estimation [J]. World Earthquake Engineering, 2022, 38(02): 151-9.
- [5] Zhao D, Wang Z, Li Z, et al. Luding Ms6.8 Earthquake Rapid Assessment of Building Losses [J]. World Earthquake Engineering, 2023, 39(2).

## 7. Contact Information
- zifa@iem.ac.cn
- denco666@163.com
- siranyang111@gmail.com
