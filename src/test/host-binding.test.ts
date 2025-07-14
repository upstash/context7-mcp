#!/usr/bin/env node

import { spawn } from "child_process";
import { setTimeout } from "timers/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Test that the server binds to 0.0.0.0 and can be accessed from different addresses
async function testHostBinding() {
  console.log("Testing host binding to 0.0.0.0...\n");

  const testPort = 8085;

  // Start the server
  const child = spawn(
    "node",
    ["dist/index.js", "--transport", "http", "--port", testPort.toString()],
    {
      stdio: ["ignore", "ignore", "pipe"],
    }
  );

  let stderrOutput = "";
  child.stderr.on("data", (data) => {
    stderrOutput += data.toString();
  });

  // Wait for server to start
  await setTimeout(1500);

  console.log(`Server stderr: ${stderrOutput.trim()}`);

  // Test different ways to access the server
  const testCases = [
    { host: "0.0.0.0", description: "Direct 0.0.0.0 access" },
    { host: "127.0.0.1", description: "Localhost access" },
    { host: "localhost", description: "Localhost hostname access" },
  ];

  let passedTests = 0;

  for (const testCase of testCases) {
    try {
      const { stdout } = await execAsync(`curl -s -m 2 http://${testCase.host}:${testPort}/ping`);
      if (stdout.trim() === "pong") {
        console.log(`✅ ${testCase.description} - Server accessible`);
        passedTests++;
      } else {
        console.log(`❌ ${testCase.description} - Unexpected response: ${stdout}`);
      }
    } catch (error) {
      console.log(
        `❌ ${testCase.description} - Connection failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Clean up
  child.kill();
  await setTimeout(100);

  console.log(`\nHost binding test results: ${passedTests}/${testCases.length} passed`);

  if (passedTests === testCases.length) {
    console.log("🎉 All host binding tests passed!");
    process.exit(0);
  } else {
    console.log("💥 Some host binding tests failed!");
    process.exit(1);
  }
}

testHostBinding().catch(console.error);
