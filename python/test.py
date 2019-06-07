import pymongo
import serial 

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["mydb"]
mycol = mydb["Sensor"]

mydict = { "name": "John", "address": "Highway 37" }
x = mycol.insert_one(mydict)