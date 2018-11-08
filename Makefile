all: build

.PHONY: install
install:
	@npm install

.PHONY: lerna
lerna:
	@lerna bootstrap

.PHONY: build
build:
	@npm run build

.PHONY: build/client/loopback/demo3a
build/client/loopback/demo3a:
	@(cd packages/sc-app-server-demo3a && npm run build:client) && cp packages/sc-app-server-demo3a/client/build/loopback.bundle.js packages/sc-app-frontend-demo3a/public/js/

.PHONY: build/client/loopback/demo3b
build/client/loopback/demo3b:
	@(cd packages/sc-hub && npm run build:client) && cp packages/sc-hub/client/build/loopback.bundle.js packages/sc-app-frontend-demo3b/public/js/

.PHONY: start
start:
	@npm run start

.PHONY: start/frontend/demo3a
start/frontend/demo3a:
	@(cd packages/sc-app-frontend-demo3a && PORT=8080 npm start)

.PHONY: start/frontend/demo3b
start/frontend/demo3b:
	@(cd packages/sc-app-frontend-demo3b && PORT=8080 npm start)

.PHONY: start/server/demo3a
start/server/demo3a:
	@(cd packages/sc-app-server-demo3a && npm start)

.PHONY: start/hub
start/hub:
	@(cd packages/sc-hub && npm start)

.PHONY: start/testrpc
start/testrpc:
	@ganache-cli -m "purse alien once arrive fitness deposit visa token sun brick intact slam"

.PHONY: deploy/contracts
deploy/contracts:
	@(cd packages/channel-contracts && rm -rf build && truffle deploy)

.PHONY: statechannel/open/demo3a
statechannel/open/demo3a:
	@./packages/sc-app-server-demo3a/scripts/open_channel.js

.PHONY: test/contracts
test/contracts:
	@(cd packages/channel-contracts && truffle test)

.PHONY: test/hub/user
test/hub/user:
	@(cd packages/sc-hub && mocha test/user.js)

.PHONY: test/hub/application
test/hub/application:
	@(cd packages/sc-hub && mocha test/application.js)

.PHONY: test/hub/channel
test/hub/channel:
	@(cd packages/sc-hub && mocha test/channel.js)

.PHONY: test/hub
test/hub:
	@(cd packages/sc-hub && mocha test/*.js)