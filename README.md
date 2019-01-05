# The Crowd Auth Service

## Requirements

* Nodejs
* gcloud cli

## Setup

First things first make sue you have gckoud cli setup and configured for the correct account based on the instructions in the [bookshelf example](https://cloud.google.com/nodejs/getting-started/tutorial-app).

## Proxy the database or setup your local.

Proxy the google cloud sql dev instance so you can point to your local.

Download the proxy

MACOS 64-BIT:

```
curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64
```

LINUX 64-BIT:

```
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
```

Windows:
see https://cloud.google.com/sql/docs/mysql/connect-admin-proxy

Make it executable

```
chmod +x cloud_sql_proxy
```

Run the proxy

```
$ ./cloud_sql_proxy -instances="[YOUR_INSTANCE_CONNECTION_NAME]"=tcp:3306
```

or

```
$ npm run-script db:proxy
```

Cool you should be good to go on the db.

## Setup the app.

Install dependencies

```
$ npm i
```

Run your server

```
$ npm start
```

your app should be available at [localhost:3000](http://localhost:3000)

## Check the [postman docs](https://documenter.getpostman.com/view/13399/RWgnZ1DH) for examples.


## Testing

A [Mocha](https://mochajs.org/) test harness has been set up. Tests are found in
the `test` directory, replicating the style of a Rails/Sails application where
the directory structure from `app` is (basically) mirrored inside `test`.

To execute the tests one time, execute `npm test` (or `npm run test`). To
execute the tests in "watch-mode" (where tests will be run after every file
change), execute `npm run test:watch`.
