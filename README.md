Booking Mean
================

Mean Application for booking flights

## Installation

```bash
  npm install
```

Start mongodb.

Import the following json files to the database (boxever-dev for development, boxever for production)

```bash
mongoimport --db boxever-dev --collection cities --file cities.json
mongoimport --db boxever-dev --collection flights --file flights.json
```

Then, execute grunt command to initiate the application the port 3000
```bash
  grunt
```
Go to the browser and enter:
```bash
localhost:3000
```

## Usage

* Click Signup to get started.
* Configure your app to work with your social accounts, by editing the /config/env/*.js files.
* Edit your users module.
* Add new CRUD modules.
* Have fun...

## Technologies

I used:
* Database MongoDB.
* NodeJs and Express for the backend.
* AngularJs, Bootstrap (Html5 CSS3) for frontend.
* WebSockets for the comunication.
* Passport for the login.
* Grunt for the automatation of some tasks.
* Karma for the tests.

##Todo

* Correct tests
* Improve database collections
