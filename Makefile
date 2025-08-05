.DEFAULT_GOAL := help

help:
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*: *.*## *" | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

init:
	@pnpm install

link:
	@pnpm link

build:
	@pnpm run build

release_patch: release

release_minor: build
	@.scripts/finish-release minor

release_major: build
	@.scripts/finish-release major

release: build
	@.scripts/finish-release patch
