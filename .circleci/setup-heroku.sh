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

heroku run bash -a $HEROKU_APP_NAME
git remote add heroku git@heroku.com:$HEROKU_APP_NAME.git
heroku git:remote -a $HEROKU_APP_NAME