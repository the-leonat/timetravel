from operator import itemgetter

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
      
sortedCityList = sorted(cityList, key=lambda k: int(k[4])) 
with open(outFileString, "w") as outStream:
  for item in sortedCityList:
    outStream.write(','.join(item))
