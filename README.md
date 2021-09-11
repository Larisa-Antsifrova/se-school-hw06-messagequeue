![Banner](./tools-banner.png)

# SE School - HW06 - Message Broker

This REST API web server app provides basic features:

- registering new users
- logging existing users in
- showing current BTC to UAH rate to authorized users

The db files are commited for example purposes.

The homework's goal is:

- to implement logs handling using RabbitMQ

The homework's motto:

- _Comming soon_

## Note to code reviewer

Hi Oleksandr!  
&nbsp;  
IN PROGRESS...

## Setting up the app locally

1. Clone the repository:

```
      git clone https://github.com/Larisa-Antsifrova/se-school-hw03-testing.git
```

2. Go to the cloned project folder:

```
      cd se-school-hw03-testing
```

3. Create .env file. Declare env variables for JWT and rates provider:

```
      JWT_SECRET_KEY={custom secret key for JWT sign: any string}

      COINLAYER_API_KEY={api key for coinlayer rates api}
```

4. Install dependencies:

```
      npm i
```

5. Start the app in development mode:

```
      npm run start:dev
```


## Endpoints

### / - Home

Returns welcome message with basic information about other endpoints.

#### Home endpoint request

```shell

GET /

```

#### Home endpoint response

```shell

Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "message": "Welcome! Please visit /user/create endpoint to register or /user/login to login.
  Once logged in you can visit /btcRate to learn what current bitcoin rate is."
  }

```

### /user/create - Registration of a new user

Registers new users.

- Name, email and password are required.
- The fields are validated with Joi library.
- If the email is already in use, the error of conflict is returned.
- If validation is successful and email is unique, the password is hashed and the new user is saved in database.
- No authentication token is returned in case verification stage will be added (for example, verification via e-mail).

#### Registration request

```shell

POST /user/create
Content-Type: application/json
RequestBody: {
  "name": "Software Engineering School",
  "email": "software@engineering.school",
  "password": "ses123456"
}

```

#### Registration validation error

```shell

Status: 400 Bad Request
Content-Type: application/json
ResponseBody: <Joi validation message>

```

#### Registration conflict error

```shell

Status: 409 Conflict
Content-Type: application/json
ResponseBody: {
  "message": "This email is already in use."
}

```

#### Registration success response

```shell

Status: 201 Created
Content-Type: application/json
ResponseBody: {
  message: "You have successfully registered."
}

```

### /user/login - Logging in a user

Authenticates a user.

- Email and password are required.
- The fields are validated only for their presence.
- If a user with the provided e-mail and/or password does not exist in database, general error message is returned.
- If validation is successful and credentials are right, the JSON Web Token is created and returned.
- JWT has limited life span.

#### Login request

```shell

POST /user/login
Content-Type: application/json
RequestBody: {
  "email": "software@engineering.school",
  "password": "ses123456"
}

```

#### Login validation error

```shell

Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  "message": "<field> is required"
}

```

#### Login authentication error

```shell

Status: 401 Unauthorized
ResponseBody: {
  "message": "Invalid credentials."
}

```

#### Login success response

```shell

Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "message": "You have successfully logged in.",
  "user": {
      "name": "Software Engineering School",
      "email": "software@engineering.school",
      "token": <header.payload.signature>
    }
}

```

### /btcRate - Current BTC to UAH rate information

Provides current rate of BTC to UAH.

- The endpoint is available only for authenticated users.
- isAuthenticated middleware verifies JWT in Authorization header (Bearer token).
- If the provided JWT is valid the endpoint returns current rate of 1 BTC to UAH.
- [Coinlayer API](https://coinlayer.com/documentation) is used to get the rate.

#### Current BTC to UAH rate request

```shell

GET /btcRate

```

#### Rate response

```shell

Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "timestamp": 1624571946,
  "target": "UAH",
  "rates": {
      "BTC": 958151.489893
    }
  }

```

## Structure

| File/Folder     | Description                                                        | Example                                               |
| :-------------- | :----------------------------------------------------------------- | :---------------------------------------------------- |
| app.js          | Project's app starting point                                       | -                                                     |
| server.js       | Project's server set up and listening                              | -                                                     |
| configs         | Configurations of specific service classes and api characteristics | validation-config, repository-config, services-config |
| controllers     | Endpoints' handlers                                                | home-controllers, user-controllers                    |
| db              | Two file system databases: for testing and for development         | test-db                                               |
| docs            | Application's desired architecture diagram                         | web-btc-api-arch                                      |
| exceptions      | Class to generate custom api errors                                | api-errors                                            |
| fs_odm          | Layer to word directly with file system                            | fs-db-mapper                                          |
| helpers         | Project's constants                                                | HTTP codes, Messages                                  |
| http            | Configured axios client                                            | axios-coinlayer                                       |
| middleware      | Middleware functions                                               | isAuthenticated, validation                           |
| rates_providers | Configured providers of rates                                      | coinlayer-provider                                    |
| repositories    | CRUD methods to work with database collections                     | users-repository                                      |
| routes          | Endpoints                                                          | /user/create, /user/login                             |
| services        | Classes to work with app's services                                | auth-service, password-service                        |
| tests           | Unit and integration tests                                         | auth-service.test, password-service.test              |
| tests_postman   | Tests for Postman collection                                       | postman-collection                                    |
| .example.env    | Info about expected environment variables                          | JWT_SECRET_KEY                                        |

## Tools

- JavaScript (Node.js)
- [Express](https://expressjs.com/) - Node.js web application framework.
- [Axios](https://www.npmjs.com/package/axios) - for fetch requests from external service.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - for hashing passwords.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - for generating, signing, verifying JWT.
- [helmet](https://www.npmjs.com/package/helmet) - for securing the Web API.
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) - for setting rate limits on requests to the Web API.
- [Joi](https://joi.dev/api/) - for validating data provided in POST requests.
- [Jest](https://jestjs.io/) - for testing: primary framework.
- [supertest](https://www.npmjs.com/package/supertest) - for integration testing.
- [Postman](https://www.postman.com/) - for automated endpoints testing.
- [newman](https://www.npmjs.com/package/newman) - for launching authomated tests in cli.
- [newman-reporter-htmlextra](https://www.npmjs.com/package/newman-reporter-htmlextra) - for generating automated tests report.
- [IDE Jest extention](https://github.com/jest-community/vscode-jest) - for tracking running tests while typing.

## Resources

Rates provider:

- [Coinlayer](https://coinlayer.com/documentation)

Message Queue:

- IN PROGRESS...

