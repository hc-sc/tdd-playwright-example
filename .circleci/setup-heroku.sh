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
heroku deploy:jar "api/build/libs/api##1.0.0.null.jar --app tdd-playwright-example"
# heroku run bash -a $HEROKU_APP_NAME
# git remote add heroku git@heroku.com:$HEROKU_APP_NAME.git
# heroku git:remote -a $HEROKU_APP_NAME