/* eslint-disable no-console */
const fetch = require('node-fetch')

const GITHUB_API_ENDPOINT = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}`

/**
 * @param {string} branch
 * @returns {Promise}
 */
async function listWorkflowExecutions (branch) {
  const res = await fetch(`${GITHUB_API_ENDPOINT}/actions/runs?per_page=10`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const { workflow_runs: runs } = await res.json()

  return runs
    .filter(run => run.status !== 'completed')
    .filter(run => run.head_branch === branch)
}

/**
 * @param {object} opts
 * @param {string} opts.workflowFile
 * @param {string} opts.branch
 * @returns {Promise}
 */
async function executeWorkflow ({ workflowFile, branch }) {
  console.log('Sending request to Github')

  const res = await fetch(`${GITHUB_API_ENDPOINT}/actions/workflows/${workflowFile}/dispatches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`
    },
    body: JSON.stringify({
      ref: branch
    })
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  console.log(`Workflow ${workflowFile} triggered`)
}

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

  // List current executions
  const runs = await listWorkflowExecutions('master')
  if (runs.length > 0) {
    console.log('An other action is already running')
    return {
      statusCode: 201
    }
  }

  // Parse request body and check action
  const body = JSON.parse(event.body || '{}')
  if (body.action === 'published' || body.action === 'unpublished') {
    await executeWorkflow({
      workflowFile: 'production.yml',
      branch: 'master'
    })
  } else {
    console.log(`Action '${body.action}' not recognized`)
  }

  console.log('Send response to Storyblok')
  return {
    statusCode: 200
  }
}
