# user-trade-api
CRUD Operations for a User-Trade engine


This repo fulfills requirements of 2 services `Trades` and `Users` with the following use cases:
- Prepare data models of User and Trade. You can use this predefined data schema for your
reference: https://dbdiagram.io/d/630e30c30911f91ba5fab2e4
- Create CRUD endpoints for Trade data model
- Trades that have executionDate in the past cannot be updated/deleted
- User who does not own the trade cannot update/delete that trade
- Build a query endpoint that takes the following parameters (all optional) and returns the aggregated trade summary
  - UserId
  - executionStartDate
  - executionEndDate
  - executionType
- (Optional) Containerize your application

**Note:** Actual DB schema used can be found [here](https://dbdiagram.io/d/631611c10911f91ba53c0882)

## Project setup prerequisits
- Pre Install `node`, `npm`, `postgres` and `mongodb`.
- Log into Postgresql and create `trades` database using `create database trades;`
- Log into Postgresql and create `id` databases using `create database id;`
- Log into MongoDB and create `userDB` databases. Use https://www.mongodb.com/basics/create-database

## Local environment setup
Follow the following steps to run the service:
- Clone the project using: `git clone https://github.com/rjch12/user-trade-api.git`
- Go to the repo directory using: `cd user-trade-api`
- Run `npm i`
- Run `npm start`

## Trade Service
The `Trades` service manages all the REST API hit the `/trades/` endpoint. This service uses a RDBMS `Postgresql` to store transactions and 
ensure ACID properties for `CRUD operations` on Trades. Following are more details on the APIs and descriptions:

- Create: Creates a new trade in the database and adds it to User's transaction details object (check getUser API).
  - Request Type: `POST`<br />
  - endpoint: `/trade/createTrade/`<br />
  - sample request body: <br />
```json
{
  "ticker": "AAPL",
  "orders": 100,
  "price": "4",
  "executionType": "buy",
  "executionStartDate": "2022-09-09T12:36:58-04:00",
  "executionEndDate": "2022-09-09T12:36:58-04:00",
  "userid": 1
}
```
- Get: Returns details of the trade from the database using the tradeid from the request query params.
  - Request Type: `GET`
  - endpoint: `/trade/getTrade/`
  - sample request query params: 
```json
{
  "tradeid": 1
}
```
- Update: Updates the existing trade details in the database and updates the User's transaction details object as well.
  - Request Type: PUT
  - endpoint: `/trade/updateTrade/`
  - sample request body: 
```json
{
    "tradeid": 1,
    "ticker": "ADBE",
    "orders": 100,
    "price": "4",
    "executionType": "sell",
    "executionStartDate": "2022-09-09T12:36:58-04:00",
    "executionEndDate": "2022-09-09T12:36:58-04:00",
    "userid": 1
}
```
- Delete: Deletes a trade in the database and removes it from User's transaction details object.
  - Request Type: POST
  - endpoint: `/trade/deleteTrade/`
  - sample request query params: 
```json
{
  "tradeid": 1,
  "userid": 1
}
```
- Summary: Returns details of all trades from the database that match all the (optional) query params.
  - Request Type: GET
  - endpoint: `/trades/getSummary/`
  - sample request body: 
```json
{
    "userid": 1
    "executionType": "sell",
    "executionStartDate": "2022-09-09T12:36:58-04:00",
    "executionEndDate": "2022-09-09T12:36:58-04:00",
}
```

**Note:** Import the `APITests.postman_collection.json` from the repo in PostMan to auto populate the API params and execute 

## User service 
The `User` service manages all the REST API that hit the `/users/` endpoint. This service uses a NoSQL `MongoDB` to store User details and 
ensure schemaless properties for `CRUD operations` on Users. Following are more details on the APIs and descriptions:

- Create: Creates a new user in the mongodb.
  - Request Type: `POST`
  - endpoint: `/users/createUser/`
  - sample request body: 
```json
{
    "title": "Mr.",
    "first_name": "John",
    "last_name": "Doe",
    "email": "Abc@yahoo.com",
    "transactions": {}
}
```
- Get: Returns details of the user from the database using the email from the.
  - Request Type: `GET`
  - endpoint: `/users/getUser/`
  - sample request query params: 
```json
{
  "email": Abc@yahoo.com
}
```

## Limitations and TODO
Following are some features that I believe should be added but needs more discussion before proceeding:
- REQUEST body validation with schema for PUT requests: This can be done using the node `Joi` module.
- DB Rollback: For transactions that are failed, the system does not rollback all pre db operations done for the request. For now, I've marked this TODO.
- Tests: There are no inbuild unit tests for this repo. Tests can be added using express and mocha with jest mocking functions.
- This repo creates only the required tables in the `config.database` hence it expects that Postgres and Mongo DB have the required `databases` pre created.
- This repo could not be dokerized because of port setting issues with my local machine. This is a machine specific issue and might work on other machines or VMs. 
