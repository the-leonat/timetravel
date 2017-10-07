from operator import itemgetter
import csv
import json

inFileString = "worldcitiespop.txt"
outFileString = "out.txt"

cityList = []
sortedCityList = []

#Country,City,AccentCity,Region,Population,Latitude,Longitude

with open(inFileString, "r") as inStream:
  for line in inStream:
    cl = line.split(",")
    if(cl[0] == "de" and cl[4] != ""):
      cityList.append(cl)
      
sortedCityList = sorted(cityList, key=lambda k: int(k[4]), reverse=True) 

with open(outFileString, "w") as outStream:
  index = 0
  for item in sortedCityList:
    index+=1
    if(index <= 25):
      outStream.write(','.join(item))
