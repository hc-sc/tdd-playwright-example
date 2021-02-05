#!/bin/bash

set -eou pipefail

# install certs
mkcert -install -pkcs12 localhost
cp localhost.p12 ./api/src/main/resources/
cp localhost.p12 ./site/src/main/resources/
rm localhost.p12