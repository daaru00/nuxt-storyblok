build-NuxtLayer:
	npm ci
	NUXT_TARGET=server npm run build:standalone

	mkdir -p "$(ARTIFACTS_DIR)/nuxt"

	cp -r .nuxt "$(ARTIFACTS_DIR)/nuxt"
	cp -r static "$(ARTIFACTS_DIR)/nuxt"
	cp nuxt.config.js "$(ARTIFACTS_DIR)/nuxt"
	cp nuxt.config.server.js "$(ARTIFACTS_DIR)/nuxt"
