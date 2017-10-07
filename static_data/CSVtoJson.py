import csv
import json
import io

csvfile = io.open('out.txt', 'r', encoding='utf-8')
jsonfile = io.open('cities.json', 'w')

fieldnames = ["country","city","accentCity","region","population","lat","long"]
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')
