

# -*- coding: utf-8 -*-
"""
Created on Mon Nov 21 10:44:28 2022

@author: zifa wang zifa@iem.ac.cn
"""


import pandas as pd
import numpy as np
import math
import os
from math import radians, cos, sin, asin, sqrt
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)



#%%  

   
excel_file = r"D:\DeskTop\software impact\example data\gme_para.xlsx"  
xls = pd.ExcelFile(excel_file)
dfs = {sheet_name: xls.parse(sheet_name) for sheet_name in xls.sheet_names}
Period=0

df_Crustal = dfs['Crustal'] 
df_Crustal= df_Crustal[df_Crustal['period']==Period]

df_interface = dfs['Interface']
df_interface= df_interface[df_interface['period']==Period]

df_slab = dfs['Slab']
df_slab= df_slab[df_slab['period']==Period]
    


def attenuation_crusal(mag,dist,fDepth,VS30,FaultMech1):
    magc=7.1
    xcr0=2
    DistV=0
    if fDepth <=25:
        eqkType=1
    else:
        eqkType=2
    if (FaultMech1=='R')|(FaultMech1=='O')|(FaultMech1=='U'):   
        FaultMech=1
    if FaultMech1=='S':
        FaultMech=2
    if FaultMech1=='N':
        FaultMech=3
    c1=float(df_Crustal['c1'])          
    c2=float(df_Crustal['c2'])
    ccr=float(df_Crustal['ccr'])
    dcr=float(df_Crustal['dcr'])
    Fcrn=float(df_Crustal['Fcrn'])
    FumRV=float(df_Crustal['FumRV'])
    FumNS=float(df_Crustal['FumNS'])
    bcr=float(df_Crustal['bcr'])
    gcr=float(df_Crustal['gcr'])
    gUM=float(df_Crustal['gUM'])
    gcrN=float(df_Crustal['gcrN'])
    gcrl=float(df_Crustal['gcrl'])
    ecr=float(df_Crustal['ecr'])
    eum=float(df_Crustal['eum'])
    ecrv=float(df_Crustal['ecrv'])
    ycr=float(df_Crustal['ycr'])
    s2=float(df_Crustal['s2'])
    s3=float(df_Crustal['s3'])
    s4=float(df_Crustal['s4'])
    fSR1s=float(df_Crustal['fSR1s'])
    fSR2s=float(df_Crustal['fSR2s'])
    fSR3s=float(df_Crustal['fSR3s'])
    fSR4s=float(df_Crustal['fSR4s'])
    fSR1um=float(df_Crustal['fSR1um'])
    fSR2um=float(df_Crustal['fSR2um'])
    fSR3um=float(df_Crustal['fSR3um'])
    fSR4um=float(df_Crustal['fSR4um'])
    LNAmax1=float(df_Crustal['LNAmax1'])
    LNAmax2=float(df_Crustal['LNAmax2'])
    LNAmax3=float(df_Crustal['LNAmax3'])
    LNAmax4=float(df_Crustal['LNAmax4'])
    SRC1=float(df_Crustal['SRC1'])
    SRC2=float(df_Crustal['SRC2'])
    SRC3=float(df_Crustal['SRC3'])
    SRC4=float(df_Crustal['SRC4'])
    LNSCIAm=float(df_Crustal['LNSCIAm'])
      
    if VS30>600:
        LNAmax=LNAmax1
        SRC=SRC1
        fSRs=fSR1s
        fSRum=fSR1um
        LnANmax=LNSCIAm
        imf=0.91
    if 300<VS30<=600:
        LNAmax=LNAmax2
        SRC=SRC2
        fSRs=fSR2s
        fSRum=fSR2um
        LnANmax=LNSCIAm+s2
        imf=1.023
    if 200<VS30<=300:
        LNAmax=LNAmax3
        SRC=SRC3
        fSRs=fSR3s
        fSRum=fSR3um
        LnANmax=LNSCIAm+s3
        imf=1.034
    if  VS30<=200:
        LNAmax=LNAmax4
        SRC=SRC4
        fSRs=fSR4s
        fSRum=fSR4um
        LnANmax=LNSCIAm+s4
        imf=0.737    
    
    if mag<=magc:
        r0 = xcr0+dist + math.exp(c1+c2*mag)
        SpeCalLog=ccr*mag   
    else:
        r0 = xcr0+dist + math.exp(c1+c2*magc)
        SpeCalLog=ccr*magc+dcr*(mag-magc)
    
    if eqkType==1:
        SpeCalLog=SpeCalLog+bcr*fDepth+gcr*math.log(r0)+ecr*dist
        if FaultMech==3:
            SpeCalLog=SpeCalLog+Fcrn
    else:
        if FaultMech==1:
            SpeCalLog=SpeCalLog+FumRV
        if FaultMech>=2:
            SpeCalLog=SpeCalLog+FumNS
        SpeCalLog=SpeCalLog+gUM*math.log(r0)+eum*dist
    
    SpeCalLog=SpeCalLog+gcrl*math.log(dist+200.0)+ycr
    if dist<=30.0:
      SpeCalLog=SpeCalLog+gcrN*math.log(xcr0+dist+math.exp(c1+6.5*c2))
    else:
      SpeCalLog=SpeCalLog+gcrN*math.log(xcr0+30.0+math.exp(c1+6.5*c2))
    if DistV>0:
      SpeCalLog=SpeCalLog+ecrv*DistV  
    
    RockSpeCalLog=SpeCalLog-LNSCIAm
    nSReff=math.exp(RockSpeCalLog)*imf                  
    nSReffc=SRC*imf
    LnSF=LnANmax-LNAmax
    Alfa1D=2
    Beta1D=0.6
    if math.exp(LnANmax)<1.25:
      ca=LNAmax/(math.log(Beta1D)-math.log(nSReffc**Alfa1D+Beta1D))
      cb=-ca*math.log(nSReffc**Alfa1D+Beta1D)
      SNC=math.exp((ca*(Alfa1D-1.0)*math.log(Beta1D)*math.log(10.0*Beta1D)-math.log(10.0)*(cb+LnSF))/(ca*(Alfa1D*math.log(10.0*Beta1D)-math.log(Beta1D))))
    else:
      SNC=(math.exp((LnANmax*math.log(nSReffc**Alfa1D+Beta1D)-LnSF*math.log(Beta1D))/LNAmax)-Beta1D)**(1.0/Alfa1D)
    if eqkType==1:
        SMR=nSReff*SNC/nSReffc*fSRs
    if eqkType==2:
        SMR=nSReff*SNC/nSReffc*fSRum
    if SMR!=0.0:
      SpeCalLog=RockSpeCalLog+LnANmax-LNAmax*(math.log(SMR**Alfa1D+Beta1D)-math.log(Beta1D))/(math.log(nSReffc**Alfa1D+Beta1D)-math.log(Beta1D))
    else:
      SpeCalLog=RockSpeCalLog+LnANmax 
      
    return math.exp(SpeCalLog)*1000




def attenuation_interface (mag,dist,fDepth,VS30,FaultMech1):  
   
    magc=7.1
    DistV=0  
    if fDepth <=25:
        eqkType=1
    else:
        eqkType=2
    if (FaultMech1=='R')|(FaultMech1=='O')|(FaultMech1=='U'):   
        FaultMech=1
    if FaultMech1=='S':
        FaultMech=2
    if FaultMech1=='N':
        FaultMech=3
 
    c1=float(df_interface['c1'])          
    c2=float(df_interface['c2'])
    cInt=float(df_interface['cintD'])
    cIntS=float(df_interface['cintS'])
    dInt1=float(df_interface['dint'])
    gammaIntS=float(df_interface['yints'])
    bInt=float(df_interface['bin'])
    gint=float(df_interface['gint'])
    gintLD=float(df_interface['gintLD'])
    gintLS=float(df_interface['gintLS'])
    eintv=float(df_interface['eVint'])
    eintS=float(df_interface['eintS'])
    gammaInt=float(df_interface['yint'])
    LnSCIAm=float(df_interface['LnSCIAm'])
    S2=float(df_interface['S2'])
    S3=float(df_interface['S3'])
    S4=float(df_interface['S4'])
    S5=float(df_interface['S5'])
    S6=float(df_interface['S6'])
    S7=float(df_interface['S7'])
    Fsr1=float(df_interface['Fsr1'])
    Fsr2=float(df_interface['Fsr2'])
    Fsr3=float(df_interface['Fsr3'])
    Fsr4=float(df_interface['Fsr4'])
    LNAmax1=float(df_interface['LNAmax1'])
    LNAmax2=float(df_interface['LNAmax2'])
    LNAmax3=float(df_interface['LNAmax3'])
    LNAmax4=float(df_interface['LNAmax4'])
    SRC1=float(df_interface['SRC1'])
    SRC2=float(df_interface['SRC2'])
    SRC3=float(df_interface['SRC3'])
    SRC4=float(df_interface['SRC4'])    
    
    
    if VS30>600:
        LNAmax=LNAmax1
        SRC=SRC1
        fsr=Fsr1
        SCTerm1=0
        SCTerm2=0
        imf=0.91
        SiteClass=1
    if 300<VS30<=600:
        LNAmax=LNAmax2
        SRC=SRC2
        fsr=Fsr2
        SiteClass=2
        SCTerm1=S2
        SCTerm2=S5
        imf=1.023
    if 200<VS30<=300:
        LNAmax=LNAmax3
        SRC=SRC3
        fsr=Fsr3
        SCTerm1=S3
        SCTerm2=S6
        imf=1.034
        SiteClass=3
    if  VS30<=200:
        LNAmax=LNAmax4
        SRC=SRC4
        fsr=Fsr4
        imf=0.737
        SCTerm1=S4
        SCTerm2=S7
        SiteClass=4 
    alfa1D=2.0
    beta1D=0.6
    xcr0=10.0
    magc=7.1
    Imin=1.0
    Imax=12.0
    DepthC=25.0
    if mag<=magc:
      r0 = xcr0+dist + math.exp(c1+c2*mag)
      if fDepth<=DepthC: 
          SpeCalLog=cIntS*mag
      else:
          SpeCalLog=cInt*mag
    else:
      r0 = xcr0+dist + math.exp(c1+c2*magc)
      if fDepth<=DepthC: 
          SpeCalLog=cIntS*magc+dInt1*(mag-magc)
      else: 
          SpeCalLog=cInt*magc+dInt1*(mag-magc)
    SpeCalLog=SpeCalLog+bInt*fDepth
    SpeCalLog=SpeCalLog+gint*math.log(r0)+eintv*DistV+gammaInt
    if fDepth<=DepthC:
      SpeCalLog=SpeCalLog+gammaIntS+gintLS*math.log(dist+200.0)+eintS*dist
    else:
      SpeCalLog=SpeCalLog+gintLD*math.log(dist+200.0)
#                                                               
    LnAnmax=LnSCIAm
    if SiteClass>=2:
      if fDepth<DepthC:  
          LnAnmax=LnAnmax+SCTerm1
      else:
          LnAnmax=LnAnmax+SCTerm2
    RockSpeCalLog=SpeCalLog-LnSCIAm   
    nSReff=math.exp(RockSpeCalLog)*imf  
    nSReffc=SRC*imf
    if SiteClass==1:
      LnSF=LnSCIAm-LNAmax
    else:
      if SiteClass>=2:
          if fDepth<DepthC:  
              LnSF=LnSCIAm+SCTerm1-LNAmax
          else:
              LnSF=LnSCIAm+SCTerm2-LNAmax
    if math.exp(LnAnmax)<1.25:
      ca=LNAmax/(math.log(beta1D)-math.log(nSReffc**alfa1D+beta1D))
      cb=-ca*math.log(nSReffc**alfa1D+beta1D)
      SNC=math.exp((ca*(alfa1D-1.0)*math.log(beta1D)*math.log(10.0*beta1D)-math.log(10.0)*(cb+LnSF))/(ca*(alfa1D*math.log(10.0*beta1D)-math.log(beta1D))))
    else:
      SNC=(math.exp((LnAnmax*math.log(nSReffc**alfa1D+beta1D)-LnSF*math.log(beta1D))/LNAmax)-beta1D)**(1.0/alfa1D)
    SMR=nSReff*SNC/nSReffc*fsr
    if SMR!=0.0:
      SpeCalLog=RockSpeCalLog+LnAnmax-LNAmax*(math.log(SMR**alfa1D+beta1D)-math.log(beta1D))/(math.log(nSReffc**alfa1D+beta1D)-math.log(beta1D))
    else:
      SpeCalLog=RockSpeCalLog+LnAnmax  

    return math.exp(SpeCalLog)*1000

#

def attenuation_slab(mag,dist,fDepth,VS30,FaultMech1):     
    magc=7.1
    xcr0=2
    DistV=0 
    if fDepth <=25:
        eqkType=1
    else:
        eqkType=2
    if (FaultMech1=='R')|(FaultMech1=='O')|(FaultMech1=='U'):   
        FaultMech=1
    if FaultMech1=='S':
        FaultMech=2
    if FaultMech1=='N':
        FaultMech=3
    Alfa1D=2.0
    Beta1D=0.6
    magc=7.1
    magcc=6.3
    Imin=1.0
    Imax=12.0
    DepthC=50.0
    Hcut=100.0   
    distV=0
    c1=float(df_slab['c1'])
    c2=float(df_slab ['c2'])
    cSL1=float(df_slab ['cSL1'])
    cSL2=float(df_slab ['cSL2'])
    dSL=float(df_slab ['dSL'])
    bSLH=float(df_slab ['bSL'])
    gSL=float(df_slab ['gSL'])
    gSLL=float(df_slab ['gSLL'])
    eSLV=float(df_slab ['eVSL'])
    eSL=float(df_slab ['eSL'])
    eSLH=float(df_slab ['eSLH'])
    gammaSL=float(df_slab ['y'])
    S2=float(df_slab ['S2'])
    S3=float(df_slab ['S3'])
    S4=float(df_slab ['S4'])
    LnSCIAm=float(df_slab ['LnSCIAm'])
    LNAmax1=float(df_slab ['LNAmax1'])
    LNAmax2=float(df_slab ['LNAmax2'])
    LNAmax3=float(df_slab ['LNAmax3'])
    LNAmax4=float(df_slab ['LNAmax4'])
    SRC1=float(df_slab ['SRC1'])
    SRC2=float(df_slab ['SRC2'])

    SRC3=float(df_slab['SRC3'])
    SRC4=float(df_slab['SRC4'])
    fsr1=float(df_slab['fsr1'])
    fsr2=float(df_slab['fsr2'])
    fsr3=float(df_slab['fsr3'])
    fsr4=float(df_slab['fsr4'])   
    if VS30>600:
        LNAmax=LNAmax1
        SRC=SRC1
        fsr=fsr1
        SCTerm=0
        imf=0.91
        SiteClass=1
    if 300<VS30<=600:
        LNAmax=LNAmax2
        SRC=SRC2
        fsr=fsr2
        SiteClass=2
        SCTerm=S2
        imf=1.023
    if 200<VS30<=300:
        LNAmax=LNAmax3
        SRC=SRC3
        fsr=fsr3
        SCTerm=S3
        imf=1.034
        SiteClass=3
    if  VS30<=200:
        LNAmax=LNAmax4
        SRC=SRC4
        fsr=fsr4
        imf=0.737
        SCTerm=S4
        SiteClass=4
    if mag<=magc:
      r0 = dist+math.exp(c1+c2*mag)
      SpeCalLog=cSL1*mag+cSL2*(mag-magcc)**2
    else:
      r0 = dist + math.exp(c1+c2*magc)
      SpeCalLog=cSL1*magc+cSL2*(magc-magcc)**2+dSL*(mag-magc)
    if fDepth>=Hcut:
      SpeCalLog=SpeCalLog+bSLH*Hcut
    else:
      SpeCalLog=SpeCalLog+bSLH*fDepth
    SpeCalLog=SpeCalLog+gSL*math.log(r0)+eSL*dist+eSLV*distV+gammaSL+gSLL*math.log(dist+200.0)
    if fDepth>=DepthC:
        SpeCalLog=SpeCalLog+eSLH*(0.02*fDepth-1.0)*dist
    LnAnmax=LnSCIAm
    if SiteClass>=2:
        LnAnmax=LnAnmax+SCTerm
    RockSpeCalLog=SpeCalLog-LnSCIAm
    nSReff=math.exp(RockSpeCalLog)*imf                  
    nSReffc=SRC*imf
    if SiteClass==1:
      LnSF=LnSCIAm-LNAmax
    else:
      LnSF=LnSCIAm+SCTerm-LNAmax
    if math.exp(LnAnmax)<1.25:
      ca=LNAmax/(math.log(Beta1D)-math.log(nSReffc**Alfa1D+Beta1D))
      cb=-ca*math.log(nSReffc**Alfa1D+Beta1D)
      SNC=math.exp((ca*(Alfa1D-1.0)*math.log(Beta1D)*math.log(10.0*Beta1D)-math.log(10.0)*(cb+LnSF))/(ca*(Alfa1D*math.log(10.0*Beta1D)-math.log(Beta1D))))
    else:
      SNC=(math.exp((LnAnmax*math.log(nSReffc**Alfa1D+Beta1D)-LnSF*math.log(Beta1D))/LNAmax)-Beta1D)**(1.0/Alfa1D)
    SMR=nSReff*SNC/nSReffc*fsr
    if SMR!=0.0:
      SpeCalLog=RockSpeCalLog+LnAnmax-LNAmax*(math.log(SMR**Alfa1D+Beta1D)-math.log(Beta1D))/(math.log(nSReffc**Alfa1D+Beta1D)-math.log(Beta1D))
    else:
      SpeCalLog=RockSpeCalLog+LnAnmax        
      
    return math.exp(SpeCalLog)*1000

def geodistance(lng1,lat1,lng2,lat2):                                   
    lng1, lat1, lng2, lat2 = map(radians, [lng1, lat1, lng2, lat2])
    dlon=lng2-lng1
    dlat=lat2-lat1
    a=sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2 
    dis=2*asin(sqrt(a))*6371
    return dis


def haversine(lon1, lat1, lon2_lat2):  
    lon2_lat2=pd.DataFrame(np.array(lon2_lat2).reshape(-1,2),columns=['longitude','latitude'])
    lon2=lon2_lat2.iloc[:,0]
    lat2=lon2_lat2.iloc[:,1]
    lon1, lat1 = map(radians, [lon1, lat1])
    lon2 = lon2.apply(lambda x:radians(x))
    lat2 = lat2.apply(lambda x:radians(x))
    # haversine公式 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a=((dlat/2).apply(np.sin))**2+np.cos(lat1)*np.cos(lat2)*((dlon/2).apply(np.sin))**2
    c = 2 * np.arcsin(np.sqrt(a)) 
    r = 6371  
    distance=c * r 
    return distance

#%%  
def gme(grid_dataframe,mag,dep,TectClass,FaultMech1,hypocenter_lon1,hypocenter_lat1,station_file):
    
   if   TectClass=='Crustal':
       attenuation_function=attenuation_crusal
   elif TectClass=='Interface':
       attenuation_function=attenuation_interface
   elif  TectClass=='Slab':
       attenuation_function=attenuation_slab
   print(attenuation_function)

   grid_dataframe['Dist']=np.sqrt(haversine(hypocenter_lon1,hypocenter_lat1,grid_dataframe.loc[:,['longitude','latitude']])**2+dep**2)
    
   grid_dataframe=grid_dataframe[grid_dataframe.Dist<600]
   grid_dataframe.reset_index(inplace=True)


   Grid_SJ_PGA_list=[]
   for i in range(len(grid_dataframe)):
       print('2.gme---attenuation  caculated',i)
       Grid_SJ_PGA_list.append(attenuation_function(mag,grid_dataframe.at[i,'Dist'],dep,grid_dataframe.at[i,'AVS'],FaultMech1))   
   grid_dataframe['Grid_SJ_PGA']=Grid_SJ_PGA_list
   
   if not os.path.exists(station_file): 
       print('No station file, return Attenuation result')
       station_used=0
       return grid_dataframe,station_used
   

   else:
        station_used=1
        station_dataframe=pd.read_csv(station_file)
        station_dataframe['Station_ZYJ']=np.sqrt(haversine(hypocenter_lon1,hypocenter_lat1,station_dataframe.loc[:,['station_longitude','station_latitude']])**2+dep**2)
    
        CZ_PGA_list=[]
        station_code_list=[]
        station_number_list=[]
        
        
        grid_dataframe['merge_tag']=1
        station_dataframe['merge_tag']=1
        
        
        grid_dataframe_lon=grid_dataframe['longitude']
        grid_dataframe_lat=grid_dataframe['latitude']
        for ind in grid_dataframe.index:
         
            Gird_longitude=grid_dataframe_lon[ind]
            Gird_latitude=grid_dataframe_lat[ind]
        
            station_lon_lat=station_dataframe.loc[:,['station_longitude','station_latitude']]
            Dist_from_station_to_grid =haversine(Gird_longitude,Gird_latitude,station_lon_lat)   
            station_dataframe['Dist to gird(temporary)']=Dist_from_station_to_grid
            
            for ii in range(5,25,5):
                select_station=station_dataframe[station_dataframe['Dist to gird(temporary)']<=ii]    
        
                if ii < 20 and len(select_station)==0 :         
                    continue
                if ii == 20 and len(select_station)==0 : 
                    station_code_list.append('None')
                    station_number_list.append(0)
                    CZ_PGA_list.append(0)
                    break
                        
                jz_tz_data=pd.merge(grid_dataframe[grid_dataframe.index==ind],select_station,how='left',on='merge_tag')
                Grid_SJ_PGA = grid_dataframe.at[ind,'Grid_SJ_PGA']
        
                if len(jz_tz_data)==1:
                    tz_sj_sa = attenuation_function(mag,jz_tz_data.at[0,'Station_ZYJ'],dep,jz_tz_data.at[0,'station_VS30'],FaultMech1)
                    CZ_PGA_list.append(float(jz_tz_data['PGA'] / tz_sj_sa * Grid_SJ_PGA))
                                       
                else:
        
                    for ind3 in jz_tz_data.index:          
                        jz_tz_data.at[ind3,'weight'] = attenuation_function(mag,jz_tz_data.at[ind3,'Station_ZYJ'],dep,jz_tz_data.at[ind3,'AVS'],FaultMech1)
                        jz_tz_data.at[ind3,'site_effect'] = attenuation_function(mag,jz_tz_data.at[ind3,'Station_ZYJ'],dep,jz_tz_data.at[ind3,'AVS'],FaultMech1) / attenuation_function(mag,jz_tz_data.at[ind3,'Station_ZYJ'],dep,jz_tz_data.at[ind3,'station_VS30'],FaultMech1)
                                                                                                                                                             
                   
                    jz_tz_data["station_amend_site_PGA"]=jz_tz_data['PGA']*jz_tz_data['site_effect']         
                    weight_ratio=jz_tz_data['weight']/jz_tz_data['weight'].sum()
                    station_center_record = (jz_tz_data['station_amend_site_PGA']*weight_ratio).sum()
                                 
                    R_xx=jz_tz_data['Station_ZYJ'].sum()/len(jz_tz_data)  
                    station_center_atten  = attenuation_function(mag,R_xx,dep,jz_tz_data.at[0,'AVS'],FaultMech1)
                    CZ_PGA_list.append(station_center_record / station_center_atten * Grid_SJ_PGA)
                     
                station_code_list.append(str(jz_tz_data['station_code'].values))
                station_number_list.append(len(jz_tz_data))
                print('2.gme---atterpolation  caculated',ind)
                
                break 
            

        grid_dataframe['CZ_PGA_ZDK']=CZ_PGA_list
        grid_dataframe.CZ_PGA_ZDK[grid_dataframe.CZ_PGA_ZDK==0] = grid_dataframe.Grid_SJ_PGA
   return grid_dataframe,station_used
 

