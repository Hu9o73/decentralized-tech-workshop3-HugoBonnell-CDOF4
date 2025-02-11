# E-Commerce website - How to use it (Windows)

Hugo BONNELL

## Frontend

The frontend of this project is a basic angular app. To run it, simply go to the `Frontend` folder and run the following commands:

```
npm install

npm run
```

The different dependencies should get installed and the app run on port `4200`. You can then access the frontend page at `http://localhost:4200`

## Backend

The frontend can't work without its corresponding backend ! To set it up :

(:warning: Choose only one way to setup from the ones below :warning:)

### Basic usage

- If wanting to use the basic version of the backend, you simply need an `SQL` instance running. Easiest way is by having MySQL installed on your PC. 

- Once MySQL is installed, you shall create a `.env` file inside of the `Backend` folder following this model:

```
DB_HOST=localhost
DB_USER=<your_user>
DB_PASSWORD=<your_password>
DB_DATABASE=ECOMMERCE_DB
```

- Before running the backend, connect to your MySQL instance and create a database called `ECOMMERCE_DB`. 

```
(SQL)

CREATE DATABASE ECOMMERCE_DB;
```

- Once the database is created, sequelize will create the tables and handle the rest once you run the backend.
- Thus, you can run the backend by accessing the `Backend` folder and running:

```
npm start
```

- The backend will be accessible on port `3000`, at `localhost:3000` if everyting went fine !


### Mirrored databases usage

#### Docker image, network and containers

- If you want to play with backup-ing and mirrored datbases, you can setup the mirroring version of the backend !

- First, make sure to have docker installed and running on your PC.

- Pull a MySQL image (Following steps tested using MySQL:9.2)

```
docker pull mysql:9.2
```

- Before running containers we want to create a network for them to interact !

```
docker create mysql-network 
```

- You can now run 2 containers, one for the 'master' database (deprecated term, we may refer to it as the source !), the other as its 'slave' (term also replaced by replica).

- Master (Source) database:

```
<readable version>

docker run -d --name mysql-master \
            --network mysql-network \
            -e MYSQL_ROOT_PASSWORD=masterpass \
            -e MYSQL_DATABASE=ECOMMERCE_DB \
            -e MYSQL_USER=user \
            -e MYSQL_PASSWORD=pass \
            -p 3307:3306 \
            mysql:9.2 \
            --server-id=1 \
            --log-bin=mysql-bin \
            --bind-address=0.0.0.0
```

```
<copy/paste>

docker run -d --name mysql-master --network mysql-network -e MYSQL_ROOT_PASSWORD=masterpass -e MYSQL_DATABASE=ECOMMERCE_DB -e MYSQL_USER=user -e MYSQL_PASSWORD=pass -p 3307:3306 mysql:9.2 --server-id=1 --log-bin=mysql-bin --bind-address=0.0.0.0
```

- Slave (Replica) database:
```
<readable version>

docker run -d --name mysql-slave \
        --network mysql-network \
        -e MYSQL_ROOT_PASSWORD=slavepass \
        -e MYSQL_DATABASE=ECOMMERCE_DB \
        -e MYSQL_USER=user \
        -e MYSQL_PASSWORD=pass \
        -p 3308:3306 \
        mysql:9.2 \
        --server-id=2 \
        --log-bin=mysql-bin \
        --bind-address=0.0.0.0
```

```
<copy/paste>

docker run -d --name mysql-slave --network mysql-network -e MYSQL_ROOT_PASSWORD=slavepass -e MYSQL_DATABASE=ECOMMERCE_DB -e MYSQL_USER=user -e MYSQL_PASSWORD=pass -p 3308:3306 mysql:9.2 --server-id=2 --log-bin=mysql-bin --bind-address=0.0.0.0
```

- If everything went fine, we can inspect the network and see the 2 containers running on it !

```
docker network inspect mysql-network
```

- We can proceed to setting up the MySQL instances !

#### Master database setup

- Enter the container's executable terminal and start mysql using (You'll be required to type in root's password):

```
docker exec -it mysql-master mysql -u root -p
```

- We-ll start by creating a database for our app:

```
(SQL)

CREATE DATABASE ECOMMERCE_DB;
```

- To make things 'clean' we may want to create a replication user, dedicated to the replication task. But not to make things too complex as this app isn't meant for prod, we'll stick to root user ! Access the binary logs of the master using:

```
(SQL)

SHOW BINARY LOGS;
```

- You'll get a result looking like this:

```
+------------------+-----------+-----------+
| Log_name         | File_size | Encrypted |
+------------------+-----------+-----------+
| mysql-bin.000001 |       181 | No        |
| mysql-bin.000002 |   2976760 | No        |
| mysql-bin.000003 |      1902 | No        |
+------------------+-----------+-----------+
```

- Copy the last `Log_name`, we'll use it to setup the replica database.

#### Replica database setup

- In your terminal, run `docker exec -it mysql-slave mysql -u root -p` to connect to the replica database's SQL query.

- First, you want to ensure that the database doesn't replicate anything to modify replication settings.

```
(SQL)

STOP REPLICA;
```

- Then connect the slave to the master and start the replication ! (The replica to the source)

```
CHANGE MASTER TO
  MASTER_HOST='mysql-master',
  MASTER_USER='root',
  MASTER_PASSWORD='<root_password>',
  MASTER_LOG_FILE='<the_filename_you_copied>',
  MASTER_LOG_POS=0;

START REPLICA;
```

#### Startup the backend

- Create a `.env` file according to the following model (inside the `Backend_Mirroring` folder):

```
DB_HOST=localhost
DB_DATABASE=ECOMMERCE_DB
DB_USER=root
DB_PASSWORD_MASTER=masterpass
DB_PASSWORD_SLAVE=slavepass
```

- As the database is created inside the master database, sequelize will create the tables and handle the rest once you run the backend.
- Thus, you can run the backend by accessing the `Backend_Mirroring` folder and running:

```
npm start
```

- The backend will be accessible on port `3000`, at `localhost:3000` if everyting went fine !


#### Testing

- Check the route `localhost:3000/health`.
    - It should display the database being 'master'.
- To test the app with mirroring, create some products using the Frontend (`localhost:4200`, make sure to run it).
- Access the master db container's sql query `docker exec -it mysql-master mysql -u root -p`
    - Check that the data has been inserted correctly `SELECT * FROM products;`

- Access the slave db container's sql query `docker exec -iy mysql-slave mysql -u root -p`
    - Check that te data has been replicated correctly `SELECT * FROM products;`

- Stop running the mysql-master container
- Check the route `localhost:3000/health`
    - It should now display the database being 'slave'.
- If you access the frontend on `localhost:4200` you should still see all the data available and you should still be able to interact with the app !