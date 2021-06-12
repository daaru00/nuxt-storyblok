/* eslint-disable no-console */
const CodePipeline = require('aws-sdk/clients/codepipeline')
const codePipeline = new CodePipeline({
  apiVersion: '2015-07-09',
  logger: console
})

/**
 * @param {object} event
 * @param {object} event.pathParameters
 * @param {string} event.pathParameters.token
 * @param {string} event.body
 */
exports.handler = async (event) => {
  console.log('event', JSON.stringify(event))

  // Do a basic check of path token
  if (!event.pathParameters || event.pathParameters.token !== process.env.PATH_TOKEN) {
    console.error('Invalid path token provided')
    return {
      statusCode: 401
    }
  }

  // Parse request body and check action
  const body = JSON.parse(event.body || '{}')
  if (body.action === 'published' || body.action === 'unpublished') {
    // Trigger CodePipeline execution for latest build
    await codePipeline.startPipelineExecution({
      name: process.env.CODE_PIPELINE_NAME
    }).promise()
  } else {
    console.log(`Action '${body.action}' not recognized`)
    return {
      statusCode: 204
    }
  }

  console.log('Send response to Storyblok')
  return {
    statusCode: 202
  }
}
