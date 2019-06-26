# IOT_Database
A database to store data acquired from the IOT sensor.

Using MongoDB. Node JS is used to display the contents of the db to a webpage.
The python script is used to communicate with the arduino and then upload the data to the db

1. Start the mongodb instance by using the command : sudo service mongodb start
2. cd /var/www/html
3. start the node server - node index.js
4. localhost:3000 displays the webpage. fix a static ip if you're using a router and remote connections
5. if you want to run the python scripts, activate the virtual environment source python/bin/activate
6. Remember to stop the mongo instance before shutting off the computer otherwise the data might get corrupted
