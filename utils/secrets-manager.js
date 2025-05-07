/**
 * AWS Secrets Manager utility
 * Retrieves AWS credentials from Secrets Manager
 */
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

// Secret name in AWS Secrets Manager
const SECRET_NAME = 'DSSAccess';
// Full ARN of the secret (this should match what's shown in the AWS console)
const SECRET_ARN = 'arn:aws:secretsmanager:us-east-1:241533142562:secret:DSSAccess-????';

// Region for Secrets Manager client
const REGION = 'us-east-1';

// Cache for secret value
let cachedSecrets = null;
let cacheExpiration = null;
const CACHE_TTL = 3600000; // 1 hour cache

/**
 * Get AWS credentials from Secrets Manager
 * @returns {Promise<Object>} The secret values
 */
async function getSecrets() {
  // If credentials are available in environment variables, use them as a fallback
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    console.log('Using AWS credentials from environment variables');
    return {
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION || REGION
    };
  }

  // Return cached secrets if available and not expired
  if (cachedSecrets && cacheExpiration && Date.now() < cacheExpiration) {
    return cachedSecrets;
  }

  try {
    console.log('Retrieving credentials from AWS Secrets Manager...');
    
    // Create a Secrets Manager client
    const client = new SecretsManagerClient({ region: REGION });
    
    // Send request to retrieve the secret
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: SECRET_NAME,
        VersionStage: 'AWSCURRENT',
      })
    );
    
    // Parse the secret string
    const secretData = JSON.parse(response.SecretString);
    
    // Cache the secret with expiration
    cachedSecrets = secretData;
    cacheExpiration = Date.now() + CACHE_TTL;
    
    return secretData;
  } catch (error) {
    console.error('Error retrieving secrets from AWS Secrets Manager:', error.message);
    console.log('Falling back to environment variables...');
    
    // Fallback to environment variables
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('Using AWS credentials from environment variables as fallback');
      return {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION || REGION
      };
    }
    
    throw error;
  }
}

/**
 * Initialize S3 client configuration with credentials from Secrets Manager
 * @returns {Promise<Object>} S3 client configuration
 */
async function getS3ClientConfig() {
  const secrets = await getSecrets();
  
  return {
    region: secrets.AWS_REGION || REGION,
    credentials: {
      accessKeyId: secrets.AWS_ACCESS_KEY_ID,
      secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY
    }
  };
}

module.exports = {
  getSecrets,
  getS3ClientConfig
}; 