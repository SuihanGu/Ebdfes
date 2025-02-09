# -*- coding: utf-8 -*-
"""
Created on Tue Jan 21 23:36:16 2025

@author: zifa wang zifa@iem.ac.cn
"""





from math import radians
import pandas as pd
import numpy
import scipy.stats
import random
import math




#%%
spatialDecay = -0.02524
radius = 6371 



def pairDamageCorrelation(locID1, locID2): 
    location1 = getCoordinates(locID1) 
    location2 = getCoordinates(locID2) 
    correlation = math.exp(spatialDecay * distance(location1, location2))
    return correlation

def pairDamageCorrelation_array(locID1, locID2_array): 
    location1 = getCoordinates(locID1) 
    correlation = numpy.exp(spatialDecay * haversine(location1[0],location1[1], locID2_array).values) 
    return correlation



def getCoordinates(locID):    
    longitude = float(locID // 10**6) / 10**4
    latitude = float(locID % 10**6) / 10**4
    return longitude, latitude

def getCoordinates_array(locID):    
    longitude = (locID // 10**6) / 10**4
    latitude = (locID % 10**6) / 10**4
    lon_lat_array=numpy.vstack((longitude,latitude)).T
    return lon_lat_array





def distance(location1, location2): 
    lon1, lat1 = location1
    lon2, lat2 = location2
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    sin_lat = math.sin(dlat / 2)
    sin_lon = math.sin(dlon / 2)
    a = sin_lat * sin_lat + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * sin_lon * sin_lon
    
 
    a = min(1, a)
    a = max(-1, a)

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = radius * c
    return d

def haversine(lon1, lat1, lon2_lat2):  
    lon2_lat2=pd.DataFrame(numpy.array(lon2_lat2).reshape(-1,2),columns=['longitude','latitude'])
    lon2=lon2_lat2.iloc[:,0]
    lat2=lon2_lat2.iloc[:,1]
    lon1, lat1 = map(radians, [lon1, lat1])
    lon2 = lon2.apply(lambda x:radians(x))
    lat2 = lat2.apply(lambda x:radians(x))
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a=((dlat/2).apply(numpy.sin))**2+numpy.cos(lat1)*numpy.cos(lat2)*((dlon/2).apply(numpy.sin))**2
    c = 2 * numpy.arcsin(numpy.sqrt(a)) 
    r = 6371  
    distance=c * r 
    return distance


def krigingIterpolation(sampleValues, locIDSample, locIDRemainder, correlationMatrix):
    sampleToRamainderCorrelation = numpy.zeros((len(locIDSample), len(locIDRemainder)))
    row_index = 0
    for i in locIDSample:
        sampleToRamainderCorrelation[row_index:] = pairDamageCorrelation_array(i, locIDRemainder)
        row_index = row_index+1

        print('3.corr--- kriging completed', row_index,'times')
    correlationMatrixInverse = numpy.linalg.inv(correlationMatrix)
    krigingWeights = numpy.matmul(correlationMatrixInverse, sampleToRamainderCorrelation)
    krigingEstimates = numpy.matmul(sampleValues.T, krigingWeights).T
    return krigingEstimates

#%% 

def correlation_calc (grid_dataframe,random_seed,stimulate_time,):

    
    occurrenceCount=1000 

    
    data= list(set(grid_dataframe["Loc ID"]))
    

    
    occIDList=list(range(1, occurrenceCount+1)) 
    
    generator = random.Random(str(random_seed)) 
    
    
    if len(data) > 2000:
            sampleSize= 1000
    elif len(data) > 800:
        sampleSize= 500
    else:
        sampleSize= min(200, len(data))  
    

    shuffledData = generator.sample(list(data), k=len(data))  
    locIDSample, locIDRemainder = shuffledData[:sampleSize], shuffledData[sampleSize:]   
    correlationMatrix = numpy.zeros((sampleSize, sampleSize))  
    for i in range(sampleSize):
            for j in range(i, sampleSize): 
                correlationMatrix[i,j] = pairDamageCorrelation(locIDSample[i], locIDSample[j]) 
                correlationMatrix[j,i] = correlationMatrix[i,j]     
                
    independentValues = numpy.zeros((sampleSize, len(occIDList))) 
    for i in range(sampleSize):
        for j in range(len(occIDList)):
            independentValues[i, j] = generator.gauss(0, 1)      
            print('3.corr---sampling completed',i,'times')
            
    

    epsilon=0.001
    eigenvalues = numpy.linalg.eigvals(correlationMatrix) 
    smallestEigenvalue = numpy.amin(eigenvalues) 
    if smallestEigenvalue < epsilon:
        difference = epsilon - smallestEigenvalue 
    else:
        difference=0

    L = numpy.linalg.cholesky(correlationMatrix) 
    sampleValues = numpy.matmul(L, independentValues)
    sampleValues = sampleValues / (1.0 + difference) 
    
    gaussianValues = sampleValues 
    
    if len(locIDRemainder) > 0:
        

        location_Remainder = getCoordinates_array(numpy.array(locIDRemainder))
    
        remainderValues= krigingIterpolation(sampleValues, locIDSample, location_Remainder, correlationMatrix)
        gaussianValues = numpy.concatenate((sampleValues, remainderValues), axis=0)
                  
            
    locIDOrdered = locIDSample + locIDRemainder 
    eventData = {}  
    eventData['locID'] = locIDOrdered
    
    
    for j in range(len(occIDList)):  

        eventData[str(occIDList[j])]= scipy.stats.norm.cdf(gaussianValues[:,j])
   
            
    quantile_file=pd.DataFrame(eventData)
    return quantile_file
