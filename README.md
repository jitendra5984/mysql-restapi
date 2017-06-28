# mysql-restapi

Module for gateway between MySql DB & RestAPI.

Express framework & mysql package required for database connection.

## API

### Before Installation
Make sure you have setup express project
Go [here](https://expressjs.com/) to find out more 

Make sure mysql module is instsalled before installing mysql-restapi, or install it

`$ npm install mysql --save`

### Installation

`$ npm install mysql-restapi`

First load express and mysql

```js
var express = require('express');
var mysql = require('mysql');
var mysqlrestapi  = require('mysql-restapi');
var dbconfig = require('./connections');
var app = express();
var api = mysqlrestapi(app, dbconfig);

```
Create file named connections.js on root

```js
var mysql = require('mysql');
var connection=mysql.createPool({
    host:'localhost',
    user:'DBUSER',
    password:'DBPASSWORD',
    database:'DATABASE'
});

var options = {
    apiURL:'api',
    paramPrefix:'_'
};

var corsOptions = {
  "origin": "*", // Website you wish to allow to connect
  "methods": "GET, POST, PUT, DELETE", // Request methods you wish to allow
  "preflightContinue": false,
  "optionsSuccessStatus": 200,
  "allowedHeaders": "Content-Type", // Request headers you wish to allow
  "credentials": true // Set to true if you need the website to include cookies in the requests sent
};


module.exports={connection, options, corsOptions};
```

### How to use

After completing setup given above follow these options to run APIs:

#### CRUD (GET, POST/CREATE, PUT/UPDATE, DELETE) request APIs

##### GET request for full table
`YOUR_DOMAIN/api/crud/:tablename`

##### GET request for fetching record via ID
`YOUR_DOMAIN/api/crud/:tablename/:rowID`

##### POST request for creating/entering record
`YOUR_DOMAIN/api/crud/:tablename`
Pass all parameters with fieldnames and values

##### PUT request to upload record via ID
`YOUR_DOMAIN/api/crud/:tablename/:rowID`
Pass all updated parameters with fieldnames and values 

##### DELETE request to remove/delete record via ID
`YOUR_DOMAIN/api/crud/:tablename/:rowID`
