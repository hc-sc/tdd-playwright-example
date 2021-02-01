#!/bin/bash

wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh

cat > ~/.netrc << EOF
machine api.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_API_KEY
machine git.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_API_KEY
EOF

# heroku plugins:install java
heroku plugins:install heroku-cli-deploy

# # heroku run bash -a $HEROKU_APP_NAME
# git remote add heroku git@heroku.com:tdd-playwright-example.git
# heroku git:remote -a tdd-playwright-example