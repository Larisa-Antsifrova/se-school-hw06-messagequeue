![Banner](./tools-banner.png)

# SE School - HW06 - Message Broker

This REST API web server app provides basic features:

- registering new users
- logging existing users in
- showing current BTC to UAH rate to authorized users

The homework's goal:

- to implement logs handling using RabbitMQ
- only Error level logs are expected in stdout

The homework's motto:

- _If something complicated is not working, make it simpler._

## Note to code reviewer

Hi Oleksandr!  
&nbsp;  
Thank you for the homework task! That was something completely new to learn and try. I hope I got the task right :)  
&nbsp;  
At the moment there is a class ApiLogger (in logger folder) that has two methods: one for publishing a log and another for consuming logs.  
The consumer is called in the app.js file and starts listening to any incoming messages with the routing key provided as a parameter.  
Since the application has central error handling, the publisher is created in this central handler in app.js. Thus, when an error occurs it is eventually caught by the handler where the publisher publishes the new error log to the exchange.  
&nbsp;  
I do think there should be more graceful ways to implement the task :) I will be glad to hear any feedback and recommendations.  
&nbsp;  
Happy reviewing!

## Setting up the app locally

1. Clone the repository:

```
      git clone https://github.com/Larisa-Antsifrova/se-school-hw06-messagequeue.git
```

2. Go to the cloned project folder:

```
      cd se-school-hw06-messagequeue
```

3. Create .env file. Declare env variables as per .env.example file:

```
      JWT_SECRET_KEY={random secret string for JWT sign}

      COINLAYER_API_KEY={api key for Coinlayer bitcoin rates api}

      RABBITMQ_URL={rabbitmq cloud connection link}
```

4. Build docker image:

```
      docker build -t webapiapp .
```

5. Run docker container:

```
      docker run -d  -p 8877:8877 webapiapp
```

6. Go to http://localhost:8877 in a browser. Expected result is [welcome message](#home-endpoint-response).

## Endpoints to explore

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

- Name, email, and password are required.
- The fields are validated with Joi library.
- If the email is already in use, the error of conflict is returned.
- If validation is successful and the email is unique, the password is hashed and the new user is saved in the database.
- No authentication token is returned in case the verification stage will be added (for example, verification via e-mail).

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
- If a user with the provided e-mail and/or password does not exist in the database, a general error message is returned.
- If validation is successful and credentials are right, the JSON Web Token is created and returned.
- JWT has a limited life span.

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
- If the provided JWT is valid the endpoint returns the current rate of 1 BTC to UAH.
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

| File/Folder     | Description                                                        |
| :-------------- | :----------------------------------------------------------------- |
| app.js          | Project's app starting point                                       |
| server.js       | Project's server set up and listening                              |
| configs         | Configurations of specific service classes and api characteristics |
| controllers     | Endpoints' handlers                                                |
| db              | Two file system databases: for testing and development             |
| exceptions      | Class to generate custom api errors                                |
| fs_odm          | Layer to word directly with file system                            |
| helpers         | Project's constants                                                |
| http            | Configured axios client                                            |
| logger          | Class of api logger                                                |
| middleware      | Middleware functions                                               |
| rates_providers | Configured providers of rates                                      |
| repositories    | CRUD methods to work with database collections                     |
| routes          | Endpoints                                                          |
| services        | Classes to work with app's services                                |
| tests           | Unit and integration tests                                         |
| tests_postman   | Tests for Postman collection                                       |
| .example.env    | Info about expected environment variables                          |

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
- [Docker](https://docs.docker.com/) - for spinning up a container with the app.

## Resources

Rates provider:

- [Coinlayer](https://coinlayer.com/documentation)

Message Queue:

- [RabbitMQ Docs](https://www.rabbitmq.com/documentation.html)
- [RabbitMQ Tutorials: Routing](https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html)
- [CloudAMQP](https://www.cloudamqp.com/)
