# -*- coding: utf-8 -*-
"""

Created on Thu Jan 23 15:34:51 2025

@author: zifa wang zifa@iem.ac.cn


The required Python packages are:
    
    pandas, os, numpy, scipy.stats, math, random, threading,queue, and warnings.



For the convenience of example demonstrations and program reproducibility, the program saves
the evaluation results as local files instead of in MySQL. In fact, it is easy to save 
the results to the established MySQL database using the pymysql package in Main.py.





"""

import pandas as pd
import os
import numpy as np 
import warnings

warnings.filterwarnings("ignore")
from Gme import gme
from Lsc import correlation_calc
from Rscrv import multithreading

#%%


def estimation(location_path,exposure_path,vc_path,station_info_path,storage_path,stimu_times,mag,dep,mech,telc_class,epic_lon,epic_lat):
    

    grid_dataframe=pd.read_csv(location_path)
    vulner_cruve = pd.read_csv(vc_path) 

    gme_result,station_used  =gme(grid_dataframe,mag,dep,telc_class,mech,epic_lon,epic_lat,station_info_path)


    if station_used==0:
        gme_result['pga']=gme_result['Grid_SJ_PGA']
    else :
        gme_result['pga']=gme_result['CZ_PGA_ZDK']
            
    gme_result=gme_result[gme_result.pga>60]
    gme_result.to_csv(os.path.join(storage_path,'gme_info.csv'),index=0)

    quantile_df=correlation_calc(gme_result,1,stimu_times)

    quantile_df.to_csv(os.path.join(storage_path,'corr_info.csv'),index=0)

    for country in set(gme_result.ADM1_JA):
        
        gme_result_part= gme_result[gme_result.ADM1_JA==country]
        
        sichuan_eg = pd.read_csv(os.path.join(exposure_path,f'{country}.csv'))
        
        
        sichuan_eg.Unique_ID =sichuan_eg.Unique_ID.astype(int)
    
        
        sichuan_eg =sichuan_eg[ (sichuan_eg['Unique_ID'].isin(gme_result['Unique_ID'])) ]
    

        results=multithreading(gme_result_part,10,stimu_times,quantile_df,vulner_cruve,sichuan_eg)
    
    
        loss_result=np.vstack(map(lambda i: results[i], range(10)))       
            
        
            
        
        
        pd.DataFrame(loss_result,columns=['locid'] + [f"{x}" for x in range(1, stimu_times + 1)] + ['dr_mean', 'fatality']
           ).to_csv( os.path.join(storage_path, 'loss_result',f'{country}_loss.csv')  ,index=0) 
        
        
        
    country_df = os.listdir(os.path.join(storage_path, 'loss_result'))
    agg_loss_df = pd.DataFrame()
    for i in country_df:
        print("5.loss agg---compeleted",i[:-4])
        file_path = os.path.join(storage_path, 'loss_result', i)
        loss_each_country=pd.read_csv(file_path)
        loss_each_country['country']=i[:-4]
        agg_loss_df  =  pd.concat([agg_loss_df,loss_each_country])
    agg_loss_df.to_csv(os.path.join(storage_path,'loss_agg_result.csv'),index=0)
    
    return

#%%
BASE_DIR = os.path.abspath(os.path.join(os.getcwd(), '..'))

location_path = os.path.join(BASE_DIR, "location_data.csv")
vc_path = os.path.join(BASE_DIR, "vc_model.csv")
station_info_path = os.path.join(BASE_DIR, "station_data.csv") # optional
exposure_path = os.path.join(BASE_DIR, "exposure_data")
storage_path = os.path.join(BASE_DIR, "store_path")
loss_result_path = os.path.join(storage_path, 'loss_result')


if not os.path.exists(storage_path):
    os.makedirs(storage_path)
    print(f"Directory {storage_path} has been created.")
else:
    print(f"Directory {storage_path} already exists.")

if not os.path.exists(loss_result_path):
    os.makedirs(loss_result_path)
    print(f"Directory {loss_result_path} has been created.")
else:
    print(f"Directory {loss_result_path} already exists.")


stimu_times=500
mag=7.6
dep=10
mech='R'
telc_class='Interface'
epic_lon=137.2
epic_lat=37.5

if __name__ == '__main__': 

    estimation(location_path,exposure_path,vc_path,station_info_path,storage_path,stimu_times,mag,dep,mech,telc_class,epic_lon,epic_lat)