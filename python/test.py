import pymongo
import serial 
import datetime

dt = datetime.datetime.now()
ts = dt.timestamp()#make sure to divide timestamp by 1000 to obtain
# JS timestamp
print(ts," ", dt)

if __name__ == '__main__':
    myclient = pymongo.MongoClient("mongodb://testUser:123456@192.168.1.234:27017/mydb")#:27017
    mydb = myclient['mydb']
    mycol = mydb["Sensor"]
    ser = serial.Serial('/dev/ttyUSB0', timeout=None)
     
    while(True):
        line = ser.readlines(1)
        print(type(line))
        string = line[0].decode("utf-8")
        print(string)
        string = string[:-2]
        arr = string.split(',')
        print(arr)
        if len(arr) != 5:
            continue;
        dt = datetime.datetime.now()
        ts = dt.timestamp()
        mydict = {'sensorID':arr[0],'timestamp':int(ts*1000.0),'light': float(arr[1]),'temperature': float(arr[2]),'moisture':float(arr[3]),'ph':float(arr[4])}
        #mydict = { "temperature": 77, "humidity": 45, "timestamp" : int(ts*1000.0)}
        x = mycol.insert_one(mydict)