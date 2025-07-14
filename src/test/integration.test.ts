#!/usr/bin/env node

import { spawn } from "child_process";
import { setTimeout } from "timers/promises";

// Test different port configurations and verify logging
async function testServerStartup() {
  console.log("Running integration tests for server startup...\n");

  const tests = [
    {
      name: "Default port (3000)",
      env: {},
      args: ["--transport", "http"],
      expectedPort: "3000",
      expectedHost: "0.0.0.0",
    },
    {
      name: "CLI flag port (8080)",
      env: {},
      args: ["--transport", "http", "--port", "8080"],
      expectedPort: "8080",
      expectedHost: "0.0.0.0",
    },
    {
      name: "Environment variable port (9090) - should override CLI",
      env: { PORT: "9090" },
      args: ["--transport", "http", "--port", "8080"],
      expectedPort: "9090",
      expectedHost: "0.0.0.0",
    },
  ];

  for (const test of tests) {
    console.log(`Testing: ${test.name}`);

    const child = spawn("node", ["dist/index.js", ...test.args], {
      env: { ...process.env, ...test.env },
      stdio: ["ignore", "ignore", "pipe"],
    });

    let stderrOutput = "";
    child.stderr.on("data", (data) => {
      stderrOutput += data.toString();
    });

    // Wait for server to start
    await setTimeout(1000);

    // Check if the expected log message appears
    const expectedLogMessage = `Context7 Documentation MCP Server running on HTTP at http://${test.expectedHost}:${test.expectedPort}/mcp`;

    if (stderrOutput.includes(expectedLogMessage)) {
      console.log(`✅ ${test.name} - Log message correct`);
    } else {
      console.log(`❌ ${test.name} - Log message incorrect`);
      console.log(`   Expected: ${expectedLogMessage}`);
      console.log(`   Got: ${stderrOutput.trim()}`);
    }

    // Check server responsiveness by sending a GET request to /ping
    const http = await import("http");
    const pingUrl = `http://${test.expectedHost}:${test.expectedPort}/ping`;

    await new Promise<void>((resolve) => {
      const req = http.request(pingUrl, (res) => {
        res.on("data", (chunk: Buffer) => {
          // We don't actually need to process the data, just check if request completes
          chunk.toString();
        });
        res.on("end", () => {
          if (res.statusCode === 200) {
            console.log(`✅ ${test.name} - Server responded to /ping`);
          } else {
            console.log(`❌ ${test.name} - Server /ping responded with status ${res.statusCode}`);
          }
          resolve();
        });
      });
      req.on("error", (err: Error) => {
        console.log(`❌ ${test.name} - Server did not respond to /ping: ${err.message}`);
        resolve();
      });
      req.end();
    });

    // Clean up
    child.kill();
    await setTimeout(100);
  }

  console.log("\nIntegration tests completed!");
}

testServerStartup().catch(console.error);
