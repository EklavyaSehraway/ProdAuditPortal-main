#!/usr/bin/env node
/**
 * This script generates DSS comparison data and saves it to a JSON file
 * Run with: node scripts/generate-dss-comparison.js
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

// Load AWS config
const awsConfig = require('../config/aws-config');
// Load Secrets Manager utility
const { getS3ClientConfig } = require('../utils/secrets-manager');

// File paths
const basePath = process.cwd();
const priorDssPath = path.join(basePath, 'frontend/data/priorDSS/W19 MTP Final DSS with NFP.csv');
const outputPath = path.join(basePath, 'frontend/data/dss-comparison.json');

// S3 bucket and key
const s3Bucket = awsConfig.s3.dssBucket;
const s3LatestDssKey = awsConfig.s3.latestDssKey;

/**
 * Extracts relevant data from the DSS records
 */
function extractDssData(records) {
  return records.map(record => ({
    node: record.node,
    ofd_week: record.ofd_week,
    ofd_dow: record.ofd_dow,
    final_tva: parseFloat(record.final_tva)
  }));
}

/**
 * Aggregates final_tva values by node and week
 */
function aggregateDssData(dssData) {
  const aggregated = {};
  
  dssData.forEach(item => {
    const key = `${item.node}-${item.ofd_week}`;
    
    if (!aggregated[key]) {
      aggregated[key] = {
        node: item.node,
        ofd_week: item.ofd_week,
        total_final_tva: 0,
        count: 0
      };
    }
    
    // Sum up the final_tva values
    aggregated[key].total_final_tva += item.final_tva;
    aggregated[key].count += 1;
  });
  
  // Convert to array and calculate weekly averages
  return Object.values(aggregated).map(item => ({
    node: item.node,
    ofd_week: item.ofd_week,
    final_tva: item.total_final_tva  // Use total sum, not average
  }));
}

/**
 * Creates a map for faster lookups
 */
function createDssMap(dssData) {
  const dssMap = {};
  
  dssData.forEach(item => {
    const key = `${item.node}-${item.ofd_week}`;
    dssMap[key] = item;
  });
  
  return dssMap;
}

/**
 * Load and parse the station mapping data
 */
function loadStationMapping() {
  try {
    const stationMappingPath = path.join(basePath, 'frontend/data/Mapping/Station Planner Mapping1.csv');
    const mappingContent = fs.readFileSync(stationMappingPath, 'utf-8');
    
    const mappingRecords = parse(mappingContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log('Number of mapping records:', mappingRecords.length);
    
    if (mappingRecords.length > 0) {
      const firstRecord = mappingRecords[0];
      console.log('First record keys:', Object.keys(firstRecord));
    }
    
    const stationMapping = {};
    
    mappingRecords.forEach(record => {
      const station = record.node || '';
      if (station) {
        stationMapping[station] = {
          region: record.Region || '',
          planner: record.Planner || ''
        };
      }
    });
    
    return stationMapping;
  } catch (error) {
    console.error('Error loading station mapping:', error);
    return {};
  }
}

/**
 * Fetches data from S3 bucket
 */
async function fetchFromS3(bucket, key, s3Client) {
  try {
    console.log(`Fetching ${key} from S3 bucket ${bucket}...`);
    
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    
    const response = await s3Client.send(command);
    
    // Convert the readable stream to a string
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks).toString('utf-8');
  } catch (error) {
    console.error(`Error fetching from S3 (${bucket}/${key}):`, error.message);
    throw error;
  }
}

/**
 * Main function to process DSS files
 */
async function processDssFiles() {
  try {
    console.log('Reading DSS files...');
    
    // Get S3 client config with credentials from Secrets Manager
    const s3Config = await getS3ClientConfig();
    console.log('Successfully retrieved credentials from Secrets Manager');
    
    // Create S3 client with credentials from Secrets Manager
    const s3Client = new S3Client(s3Config);
    
    // Read the prior DSS CSV file from local storage
    const priorDssContent = fs.readFileSync(priorDssPath, 'utf-8');
    
    // Fetch the latest DSS CSV file from S3
    const latestDssContent = await fetchFromS3(s3Bucket, s3LatestDssKey, s3Client);

    // Parse the CSV files
    const priorDssRecords = parse(priorDssContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    const latestDssRecords = parse(latestDssContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Prior DSS records: ${priorDssRecords.length}`);
    console.log(`Latest DSS records: ${latestDssRecords.length}`);

    // Extract the relevant data from the files
    const priorDssRawData = extractDssData(priorDssRecords);
    const latestDssRawData = extractDssData(latestDssRecords);
    
    // Aggregate data by node and week
    const priorDssData = aggregateDssData(priorDssRawData);
    const latestDssData = aggregateDssData(latestDssRawData);
    
    console.log(`Prior DSS aggregated: ${priorDssData.length} node-week combinations`);
    console.log(`Latest DSS aggregated: ${latestDssData.length} node-week combinations`);

    // Get unique nodes and weeks
    const nodes = [...new Set([
      ...priorDssData.map(item => item.node),
      ...latestDssData.map(item => item.node)
    ])].sort();
    
    const weeks = [...new Set([
      ...priorDssData.map(item => item.ofd_week),
      ...latestDssData.map(item => item.ofd_week)
    ])].sort((a, b) => parseInt(a) - parseInt(b));

    console.log(`Found ${nodes.length} unique nodes`);
    console.log(`Found ${weeks.length} unique weeks`);

    // Load mapping data and fallback to simple mapping if needed
    const mainMapping = loadStationMapping();
    
    // Try loading the simple mapping as fallback
    let simpleMappingPath = path.join(basePath, 'frontend/data/Mapping/simple-mapping.csv');
    let simpleMapping = {};
    
    try {
      if (fs.existsSync(simpleMappingPath)) {
        const simpleContent = fs.readFileSync(simpleMappingPath, 'utf-8');
        const simpleRecords = parse(simpleContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        });
        
        simpleRecords.forEach(record => {
          const node = record.Node || '';
          if (node) {
            simpleMapping[node] = {
              region: record.Region || '',
              planner: record.Planner || ''
            };
          }
        });
        
        console.log(`Loaded ${Object.keys(simpleMapping).length} nodes from simple mapping`);
      }
    } catch (error) {
      console.error('Error loading simple mapping, continuing with main mapping only');
    }
    
    // Create a map for faster lookups
    const priorDssMap = createDssMap(priorDssData);
    const latestDssMap = createDssMap(latestDssData);

    // Calculate percentage changes
    const comparisonData = {};
    const nodeMetadata = {};

    let matchCount = 0;

    nodes.forEach(node => {
      comparisonData[node] = {};
      
      // Try to get metadata from either mapping source
      const metadata = mainMapping[node] || simpleMapping[node];
      
      if (metadata) {
        nodeMetadata[node] = metadata;
        matchCount++;
      } else {
        nodeMetadata[node] = {
          region: 'Unknown',
          planner: 'Unknown'
        };
      }
      
      weeks.forEach(week => {
        const priorValue = priorDssMap[`${node}-${week}`]?.final_tva;
        const latestValue = latestDssMap[`${node}-${week}`]?.final_tva;
        
        if (priorValue && latestValue) {
          const percentChange = ((latestValue - priorValue) / priorValue) * 100;
          comparisonData[node][week] = parseFloat(percentChange.toFixed(2));
        } else {
          comparisonData[node][week] = null;
        }
      });
    });

    console.log(`Matched ${matchCount} nodes with region/planner data out of ${nodes.length}`);

    const result = {
      nodes,
      weeks,
      comparisonData,
      nodeMetadata
    };

    // Write the result to a JSON file
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    
    console.log(`Comparison data generated and saved to ${outputPath}`);
    console.log('Sample data:');
    
    // Show some sample data
    const sampleNode = nodes[0];
    console.log(`Sample for node ${sampleNode}:`);
    console.log(comparisonData[sampleNode]);
    console.log(`Metadata:`, nodeMetadata[sampleNode]);
    
    return result;
  } catch (error) {
    console.error('Error processing DSS files:', error);
    throw error;
  }
}

// Run the script
processDssFiles().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});