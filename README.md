# Psycho Slack

## Dependencies

[nodejs](https://nodejs.org/en/)

python ~2.7 (for botkit installation)

```sh
npm install
```

## Test

### Set local config

create a config file (config/default.json)

Config File example
```json
{
  "botToken": "xoxb-19876974532-7QVlS3XRzYFQ4fIkMVxIwCEd",
  "slackApiToken": "xoxp-19879990401-19874729492-19892570103-995c3fc727",
  "authToken": "cGhpbGlwcGUuZ3JhbmRtb250QGdtYWlsLmNvbTpoTlV1ajI=",
  "atmanApiUrl": "https://sandbox.atmanco.com"
}
```

### Start the server
```sh
node index.js
```
