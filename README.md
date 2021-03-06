# Nuxt Storyblok Integration

This is a Nuxt project that integrate [Storyblok CMS](https://www.storyblok.com/).

## Configurations

Create a `.env` file in the root of the project:
```
STORYBLOK_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
STORYBLOK_BRIDGE_ENABLED=yes
STORYBLOK_FRONTEND_FETCH_ENABLED=yes
STORYBLOK_VERSION=draft
```

Here a detailed list of environment variables:
**STORYBLOK_API_TOKEN**: The Storyblok API token (required).

**STORYBLOK_BRIDGE_ENABLED**: Enable the Storyblok Bridge integration, set to `yes` if you want to use the Storyblok editor preview with this environment.

**STORYBLOK_FRONTEND_FETCH_ENABLED**: Set this variable to `yes` to load Storyblok page data on the frontend during page load.

**STORYBLOK_VERSION**: The Storyblok data version to retrieve, possible values are `published` or `draft`.

## Recommended configurations

Localhost (Dev):
```
STORYBLOK_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
STORYBLOK_BRIDGE_ENABLED=yes
STORYBLOK_FRONTEND_FETCH_ENABLED=yes
STORYBLOK_VERSION=draft
```

Staging (SPA):
```
STORYBLOK_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
STORYBLOK_BRIDGE_ENABLED=yes
STORYBLOK_FRONTEND_FETCH_ENABLED=yes
STORYBLOK_VERSION=draft
```

Production (Static):
```
STORYBLOK_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
STORYBLOK_BRIDGE_ENABLED=no
STORYBLOK_FRONTEND_FETCH_ENABLED=no
STORYBLOK_VERSION=published
```

Production (SSR):
```
STORYBLOK_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
STORYBLOK_BRIDGE_ENABLED=no
STORYBLOK_VERSION=published
```

## Build Setup

Install dependencies:
```bash
$ npm install
```

Serve with hot reload at `localhost:3000`:
```bash
$ npm run dev
```

Build for production and launch server:
```bash
$ npm run build
$ npm run start
```

Generate static project:
```bash
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## AWS Infrastructure

This project describe two different approach to host a Nuxt static/spa web application:

### Frontend

`template.website.yml` template describes:
- An S3 bucket, where the code generated by Nuxt `generate` command will be deployed.
- A CloudFront distribution to handle on-the-edge caching.

**SPA Mode:**

The S3 bucket is configured to allow access from a newly created identity. CloudFront distribution use that identity to retrieve the `index.html`, additionally is configured to ignore 403 error status code from S3 Bucket (when the object does not exist, for example for nested pages) and return `index.html` with 200 status code.

**Static Mode:**

The S3 bucket will contain all the HTML generated so, in this case, is a file will not be found the bucket will return the `404.html` file and a 404 status code. The CloudFront deployment simply returns the error with modifications.

### Build pipeline

`template.pipeline` template describes:
- A CodePipeline to generate static content, upload to configured pipeline and flush CloudFront cache

### Server Side Rendering (SSR)

`template.ssr.yml` template describes:
- A Lambda Layer that contain the Nuxt generated code.
- An API gateway and a Lambda that handle the HTTP requests.

Before deploying this template build the SAM application using:
```bash
sam build --template-file template.ssr.yml
```
this will build Nuxt and copy only the necessary files in `.aws-sam/build/NuxtLayer/nuxt`.

The build process use the `Makefile` to describe steps:
- build Nuxt code (using `server` as target)
- copy `.nuxt`, `static` directory and `nuxt.config.js` into artifact directory

If `nuxt.config.js` use some npm modules the following steps are quired:
- remove `node_modules` and `package.json`
- re initialize the npm package with `npm init --yes`
- install dependencies used inside `nuxt.config.js` (`storyblok-js-client` and its requirements `axios`)
- additional install `@nuxtjs/eslint-module` required by Nuxt
- copy the `node_modules` modules into artifact directory

Note: Nuxt require at runtime both `@nuxtjs/eslint-module` (also when only loading config) and `eslint`, thats why are installed as requirements in SSR Lambda.

When deploying specify the builded template instead the `template.ssr.yaml` one in the `samconfig.toml` file:
```toml
[ssr]
[ssr.deploy]
[ssr.deploy.parameters]
stack_name = "my-stack-name"
region = "eu-west-1"
profile = "myprofile"
capabilities = "CAPABILITY_IAM"
template_file = ".aws-sam/build/template.yaml"
parameter_overrides = "DomainName=\"...\""
```
or in deploy command:
```bash
sam deploy --template-file=.aws-sam/build/template.yaml
```

## Deploy

To deploy the new version of the code push changes to `develop` (for staging environment) or `master` (for production environment). The GitHub actions will perform the following operations:
- install npm dependencies
- run Nuxt `generate` command (that also build the application)
- upload the code from `./dist` folder to the specified bucket
- create a CloudFront invalidation

It is recommended to use GitFlow to manage the repository.

## Automatic Publish

The webhook application (describe in `template.webhook.yml`) expose an API endpoint that Storyblok can call as webhook in order to trigger `production` build pipeline.
