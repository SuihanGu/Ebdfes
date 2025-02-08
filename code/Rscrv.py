
# -*- coding: utf-8 -*-
"""
Created on Fri May  5 15:26:57 2023

@author: zifa wang zifa@iem.ac.cn
"""





import threading
from queue import Queue
import numpy as np
from scipy import stats
import warnings
warnings.filterwarnings("ignore")


#%%


def loss_caculate(grid_dataframe,q,stimulation_time,quantile_df,vulner_cruve,sichuan_eg): 
    store_array=np.zeros((len(grid_dataframe),stimulation_time+3))
    k=0
    l=0
    quantile_i_list=[f"{x}" for x in range(1,stimulation_time+1)]

    for i in grid_dataframe['Loc ID']:

        grid_dataframe_i=grid_dataframe.loc[grid_dataframe['Loc ID']== i]
        
        Unique_ID_i = int(grid_dataframe_i['Unique_ID'].values)
        
        pga= float(grid_dataframe_i['pga'].values)  

        polulation= float(grid_dataframe_i['population'].values)

    
        quantile_i = quantile_df[quantile_df['locID']== i][quantile_i_list].values 
    
        eg_i = sichuan_eg[sichuan_eg['Unique_ID']== Unique_ID_i ]
        if len(eg_i)==0 :
            l=l+1
            
        
        
        
        mean_std_array= np.zeros((len(eg_i),2)) 
       
        mean_std_array_loc = 0
        for j in eg_i.Vulner_ID_y: 
   
            dr_mean=  np.interp(pga, vulner_cruve.loc[(vulner_cruve['vulnid']==j)] ['pga'],  vulner_cruve.loc[(vulner_cruve['vulnid']==j)]['mdr'])  
            dr_std=  np.interp(pga, vulner_cruve.loc[(vulner_cruve['vulnid']==j)] ['pga'],  vulner_cruve.loc[(vulner_cruve['vulnid']==j)]['std'])  
    
            
            

            mean_std_array[mean_std_array_loc,0]=dr_mean
            mean_std_array[mean_std_array_loc,1]=dr_std
            mean_std_array_loc = mean_std_array_loc+1
       
        alpha= (mean_std_array[:,0]**2-mean_std_array[:,0]**3)/mean_std_array[:,1]**2-mean_std_array[:,0]   
        beta= (1-mean_std_array[:,0])*((mean_std_array[:,0]-mean_std_array[:,0]**2)/mean_std_array[:,1]**2-1) 
        if np.sum(alpha<0) or np.sum(beta<0):
            break 
    
    
        dr_array = stats.beta(alpha,beta).ppf(quantile_i.reshape(-1,1))    
    
        df_values= eg_i.value_split.values
        
        dr_result=dr_array.mean(axis=1)
        loss_result= (dr_array* df_values.T).sum(axis=1)
        
        
        store_array[k,0]=i
        store_array[k,1:stimulation_time+1]=loss_result
        store_array[k,stimulation_time+1]=dr_result.mean()
        store_array[k,stimulation_time+2]=np.sum(dr_result>=0.8)/1000*0.02*polulation
        print('4.loss---compeleted',k)

        k=k+1
        
    q.put(store_array)
    
def multithreading(data,threads_number,stimulation_time,quantile_df,vulner_cruve,sichuan_eg):
    q=Queue()
    threads=[]
    results = []
    batch_number= int(len(data)/(threads_number))
    for i in range(threads_number):
        if i < threads_number-1:
            t= threading.Thread(target=loss_caculate, args=(data[i*batch_number:i*batch_number+batch_number], q,stimulation_time,quantile_df,vulner_cruve,sichuan_eg))
            t.start()
            threads.append(t)
        elif i== threads_number-1:
            
            t= threading.Thread(target=loss_caculate, args=(data[i*batch_number:], q,stimulation_time,quantile_df,vulner_cruve,sichuan_eg))
            t.start()
            threads.append(t)    
    
    for thread in threads:
        thread.join()
    print('all threading compeleted')
        
    for _ in range(threads_number):
        if not q.empty():
            results.append(q.get())
    return results


