# -*- coding: utf-8 -*-
"""
Created on Tue Jan 21 14:43:10 2025

@author: zifa wang zifa@iem.ac.cn

"""



import requests
import json
import datetime
import pandas as pd 
from global_land_mask import globe
from math import radians
import pymysql
import numpy as np
from apscheduler.schedulers.blocking import BlockingScheduler
from dbutils.pooled_db import PooledDB
import threading
import warnings
warnings.filterwarnings("ignore")
from Estimation import estimation
warnings.filterwarnings("ignore", message="maximum number of running instances reached")



#%% query
def is_land(lon,lat):
    is_on_land = globe.is_land(lat, lon)
    return is_on_land


def haversine(lon1, lat1, lon2_lat2):  
    lon2_lat2=pd.DataFrame(np.array(lon2_lat2).reshape(-1,2),columns=['longitude','latitude'])
    lon2=lon2_lat2.iloc[:,0]
    lat2=lon2_lat2.iloc[:,1]
    lon1, lat1 = map(radians, [lon1, lat1])
    lon2 = lon2.apply(lambda x:radians(x))
    lat2 = lat2.apply(lambda x:radians(x))
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a=((dlat/2).apply(np.sin))**2+np.cos(lat1)*np.cos(lat2)*((dlon/2).apply(np.sin))**2
    c = 2 * np.arcsin(np.sqrt(a)) 
    r = 6371  
    distance=c * r 
    return distance
def eq_query(url,nation_list,min_mag): 

    
    try: 
        response = requests.get(url, stream=True) 
        result= json.loads(response.text) 
        print('get succeed')
        result_df=pd.DataFrame( result['features']) 
        result_df['nation'] = [result_df.properties[i]['place'].split(',')[-1][1:] for i in range(len(result_df))] 
        result_df['mag'] = [result_df.properties[i]['mag'] for i in range(len(result_df))] 
        
        
        result_df=result_df[(result_df['nation'].isin(nation_list)&(result_df['mag']>=min_mag)) ]
       
        if len(result_df)>0:  
            print('Japan or China event had been capture') 
         
            conn = pool.connection()
            cur = conn.cursor()
            id_get= result_df.id.values.tolist()  
        
            for id_i in id_get:
                lock = threading.Lock()
                
                if lock.locked():
                    print("Another task is still running. Skipping this task.")
                    return

                with lock:

                    print('------------------------')        
                    index = pd.DataFrame( result['features']).id.values.tolist().index(id_i) 
                        
                    event_time=datetime.datetime.fromtimestamp(result['features'][index]['properties']['time']/1000).strftime('%Y-%m-%dT%H:%M:%S.970Z') 
                    print(event_time)
                    lon_info = result['features'][index]['geometry']['coordinates'][0] 
                    lat_info = result['features'][index]['geometry']['coordinates'][1]  
                    fault_mode='point'
                    dep_info = result['features'][index]['geometry']['coordinates'][2]  
                    event_mag=result['features'][index]['properties']['mag'] 
                    event_place=result['features'][index]['properties']['place'].split(',')[0] 
                    Mech='R'
                    event_nation=result['features'][index]['properties']['place'].split(',')[1][1:]
                    
                    if is_land(lon_info,lat_info)==True : 
                        telc_class='Crustal'   
                    elif is_land(lon_info,lat_info)==False and  dep_info< 50 :
                        telc_class='Interface'
                        
                    else:
                        telc_class='Slab'
    
                    query_try=cur.execute(f"select  * from catastrophe.eq_query_table1 where usgs_id='{id_i}'") 
                   
                     
                    if  query_try == 0:
                        
                        print(f'new id--{id_i}')
                        cur.execute("select max(eventid) from catastrophe.eq_query_table1 " )
                        max_eventid=cur.fetchall()[0][0]
                        if max_eventid is None:
                            max_eventid=0
                        insert_new ="insert  into catastrophe.eq_query_table1 (`usgs_id`,`eventid`,`time`, `latitude`, `longitude` ,`fault_mode` , `depth` ,\
                          `mag` ,       \
                          `place` ,     \
                          `nation`,     \
                          `telc_class`, \
                          `Mech` )    values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}')"
            
            
                        cur.execute(insert_new.format(id_i,max_eventid+1,event_time,lat_info,lon_info,fault_mode,dep_info,event_mag,event_place,event_nation,telc_class,Mech))
                        conn.commit()
                        print('insert new event')
                        
                        estimation(location_path,exposure_path,vc_path,station_info_path,storage_path,stimu_times,
                                   mag=event_mag,dep=dep_info,mech=Mech,telc_class=telc_class,epic_lon=lon_info,epic_lat=lat_info)
                        
    
                    
                    elif query_try > 0: 
                        print(f'{id_i} already exists')
    
            cur.close()                
            conn.close()        
        else:
            print('No any new event had been capture')
            
        print('=====================================')
        
        
        
    except Exception as error1:
        # 
        print(f"query发生了异常：{error1}")
    return()
        
       
#%% 
if __name__ == '__main__': 
    location_path=r'D:\DeskTop\software impact\example data\exposurev3.csv'
    vc_path=r"D:\DeskTop\vulner_cruve\ods_vulner_cruve_japan_202311121031.csv"
    exposure_path=r"D:\DeskTop\学术需要进一步学习\能登半岛地震\20240101地震\landscan数据\landscan格网下的各县eg_NEW"
    station_info_path=r"D:\DeskTop\250113地震\250113EQ1.csv"
    storage_path=r'D:\DeskTop\software impact\store_path'
    stimu_times=500
    nation_list=['Japan','Japan region','Japan Earthquake']
    url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"
    min_mag=3.0
    try:
        pool = PooledDB(
            
            creator=pymysql,  
            maxconnections=5,  
            host='localhost', 
            user='root',
            password='123456',
            db='catastrophe',
            port=3306, 
            charset='utf8' )
        
        sched = BlockingScheduler()

        sched.add_job(eq_query,'interval',minutes=0.1,max_instances=1,
                      kwargs={"url": url,"nation_list":nation_list,"min_mag":min_mag})

        
        sched.start()    
    except Exception as error2:
        print(f"sched error ：{error2}")    


