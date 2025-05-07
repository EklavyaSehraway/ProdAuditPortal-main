/**
 * AWS Configuration
 * This file contains the AWS configuration for connecting to S3 buckets
 */

// Default AWS region
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// S3 bucket configuration
const S3_CONFIG = {
  dssBucket: 'dsslambda',
  latestDssKey: 'W20 MTP Final DSS for NFP upload.csv'
};

module.exports = {
  region: AWS_REGION,
  s3: S3_CONFIG
}; 