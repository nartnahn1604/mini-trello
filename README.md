# Mini-trello

## Client

### Start project

```shell
cd mini_trello
npm install
npm start
```

### Folder Structure

```bash
src
----api
    ------api.js (this one for set up axios)
----assets
    ------images
----component
----context
----hooks
----ui
    ----auth
    ----main
----utils
... default file
```

## API

### Start project

```shell
cd mini_trello_api
npm install
npm start
```

### Folder Structure

```bash
src
---api
    ---v1
        ---auth
        ---board
        ---card
        ---member
        ---model
        ---task
---config
    ---db.js (for firebase connection)
    ---mailApi.js (for googleapis gmail and nodemailer)
```

### Usage

1. Make copy of ".env.sample" and rename to ".env"
2. ENV explain:

- JWT Authorization

```code
JWT_SECRET=
EXPIRES_IN=86400 #1 day
```

- Nodemailer

```code
EMAIL_USER=abc@gmail.com
```

- Firebase

```code
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

- Gmail set up

```code
GOOGLE_CALL_BACK_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

## Message Queue

In this project, I use mosquitto for light weight and fast connection

### Prerequisite

Docker, docker compose installed

### Usage

```shell
cd mqtt
docker-compose up -d
```

- Recommend tool for checking message: https://github.com/ChxGuillaume/MQ3T
