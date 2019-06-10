import pymongo
import serial 
import datetime

dt = datetime.datetime.now()
ts = dt.timestamp()#make sure to divide timestamp by 1000 to obtain
# JS timestamp
print(ts," ", dt)

if __name__ == '__main__':
	myclient = pymongo.MongoClient("mongodb://localhost:27017/")
	mydb = myclient["mydb"]
	mycol = mydb["Sensor"]

	mydict = { "temperature": 105, "humidity": 45, "timestamp" : int(ts*1000.0)}
	x = mycol.insert_one(mydict)