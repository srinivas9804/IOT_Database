import pymongo
import serial 
import datetime
import random
import time 
dt = datetime.datetime.now()
ts = dt.timestamp()#make sure to divide timestamp by 1000 to obtain
# JS timestamp
print(ts," ", dt)

if __name__ == '__main__':
    myclient = pymongo.MongoClient("mongodb://testUser:135246798@localhost:27017/mydb")#:27017
    mydb = myclient['mydb']
    mycol = mydb["Sensor"]
    
    while(True):
        dt = datetime.datetime.now()
        ts = dt.timestamp()
        mydict = {'timestamp':int(ts*1000.0),'light':random.randint(40,80),'temperature': random.randint(20,40),'moisture':random.randint(100,300),'ph':int(random.random()*10)}
        x = mycol.insert_one(mydict)
        print(ts," ", dt)
        time.sleep(5)