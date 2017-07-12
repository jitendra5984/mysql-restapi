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
/* Create database connetion */
var mysql = require('mysql');
var connection=mysql.createPool({
    host:'localhost',
    user:'DBUSER',
    password:'DBPASSWORD',
    database:'DATABASE'
});

/* Setting parameters for API url customization */
var settingOptions = {
    apiURL:'api', // Custom parameter to create API urls
    paramPrefix:'_' // Parameter for field seperation in API url
};

/* Setting options to handle cross origin resource sharing issue */
var corsOptions = {
  origin: "*", // Website you wish to allow to connect
  methods: "GET, POST, PUT, DELETE", // Request methods you wish to allow
  preflightContinue: false,
  optionsSuccessStatus: 200,
  allowedHeaders: "Content-Type", // Request headers you wish to allow
  credentials: true // Set to true if you need the website to include cookies in the requests sent
};

module.exports={connection, settingOptions, corsOptions};
```

# How to use

After completing setup given above follow these options to run APIs:

## CRUD (GET, POST/CREATE, PUT/UPDATE, DELETE) request APIs


Request Method | Request URL                            | Purpose                      | Parameters
-------------  | -------------------------------------  | ---------------------------  | -------------
GET            | YOUR_DOMAIN/api/crud/:tablename        | Fetch full table             | - 
GET            | YOUR_DOMAIN/api/crud/:tablename/:rowID | Fetch record via Row ID      | - 
POST           | YOUR_DOMAIN/api/crud/:tablename        | Create/Enter record in table | {"fieldname":"fieldvalue",---} 
PUT            | YOUR_DOMAIN/api/crud/:tablename/:rowID | Update record via ID         | {"fieldname":"fieldvalue",---}  
DELETE         | YOUR_DOMAIN/api/crud/:tablename/:rowID | Delete record via Row ID     | - 


## APIs to fetch data

Request Method | Request URL                                                           | Purpose                     
-------------  | -------------------------------------                                 | --------------------------- 
GET            | YOUR_DOMAIN/api/crud/:tablename?_limit=0,100                          | Passing limit in result            
GET            | YOUR_DOMAIN/api/crud/:tablename?_order[fieldname]=DESC                | Sort order in result            
GET            | YOUR_DOMAIN/api/crud/:tablename?_fields=fieldname1,fieldname2         | Fetch selected fields            
GET            | YOUR_DOMAIN/api/crud/:tablename?fieldname[LIKE]=%fieldvalue%          | Like query, varry % position      
GET | YOUR_DOMAIN/api/crud/:tablename?_limit=0,100&_order[fieldname ]=DESC&_fields=fieldname1,fieldname2fieldname[LIKE]=%fieldvalue% | All together      


## Custom query request APIs


Request Method | Request URL                     | Purpose                          | Parameters
-------------  | ------------------------------  | -------------------------------  | -------------
GET            | YOUR_DOMAIN/api/custom/:query   | Run custom query & get result    | - 
POST           | YOUR_DOMAIN/api/custom          | Run custom query & get result    | {"query":"SQL_QUERY"} 


## Login/check fields Post API


Request Method | Request URL                     | Purpose                          | Parameters
-------------  | ------------------------------  | -------------------------------  | -------------
POST           | YOUR_DOMAIN/api/check/:tablename | Check records availablity status | {"fieldname":"fieldvalue",---} 


