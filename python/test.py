import pymongo
import serial 
import datetime

dt = datetime.datetime.now()
ts = dt.timestamp()#make sure to divide timestamp by 1000 to obtain
# JS timestamp
print(ts," ", dt)

#myclient = pymongo.MongoClient("mongodb://localhost:27017/")
#mydb = myclient["mydb"]
#mycol = mydb["Sensor"]
#
#mydict = { "name": "John", "address": "Highway 37" }
#x = mycol.insert_one(mydict)