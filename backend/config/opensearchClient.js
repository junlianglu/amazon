// backend/config/elasticsearchClient.js

const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
require('dotenv').config();

const REGION = 'us-west-1'; // Replace with your AWS region
const ENDPOINT = process.env.OPENSEARCH_ENDPOINT; // Your OpenSearch domain endpoint

const client = new Client({
  ...AwsSigv4Signer({
    region: REGION,
    getCredentials: defaultProvider(),
  }),
  node: ENDPOINT,
});

module.exports = client;
