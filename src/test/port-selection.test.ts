#!/usr/bin/env node

import { getServerPort, SERVER_HOST } from "../lib/port-selection.js";

// Simple test framework
let testCount = 0;
let passCount = 0;

function assert(condition: boolean, message: string) {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`✅ ${message}`);
  } else {
    console.log(`❌ ${message}`);
  }
}

function assertEquals(actual: unknown, expected: unknown, message: string) {
  assert(actual === expected, `${message} (expected ${expected}, got ${actual})`);
}

// Test cases
console.log("Running port selection tests...\n");

// Test 1: Environment variable takes priority
assertEquals(
  getServerPort("8080", "9000", 3000),
  8080,
  "Environment variable should take priority over CLI flag and default"
);

// Test 2: CLI flag used when env var not set
assertEquals(
  getServerPort(undefined, "9000", 3000),
  9000,
  "CLI flag should be used when environment variable is not set"
);

// Test 3: Default used when neither env var nor CLI flag set
assertEquals(
  getServerPort(undefined, undefined, 3000),
  3000,
  "Default should be used when neither environment variable nor CLI flag is set"
);

// Test 4: Invalid environment variable falls back to CLI flag
assertEquals(
  getServerPort("invalid", "9000", 3000),
  9000,
  "Invalid environment variable should fall back to CLI flag"
);

// Test 5: Invalid CLI flag falls back to default
assertEquals(
  getServerPort(undefined, "invalid", 3000),
  3000,
  "Invalid CLI flag should fall back to default"
);

// Test 6: Both invalid values should use default
assertEquals(
  getServerPort("invalid", "invalid", 3000),
  3000,
  "Both invalid values should fall back to default"
);

// Test 7: Empty string environment variable falls back to CLI flag
assertEquals(
  getServerPort("", "9000", 3000),
  9000,
  "Empty string environment variable should fall back to CLI flag"
);

// Test 8: Empty string CLI flag falls back to default
assertEquals(
  getServerPort(undefined, "", 3000),
  3000,
  "Empty string CLI flag should fall back to default"
);

// Test 9: Custom default port
assertEquals(
  getServerPort(undefined, undefined, 8000),
  8000,
  "Custom default port should be used when specified"
);

// Test 10: SERVER_HOST constant
assertEquals(SERVER_HOST, "0.0.0.0", "SERVER_HOST should be set to 0.0.0.0");

// Test 11: Zero port from environment (edge case)
assertEquals(getServerPort("0", "9000", 3000), 0, "Zero port from environment should be accepted");

// Test 12: Negative port from environment falls back to CLI
assertEquals(
  getServerPort("-1", "9000", 3000),
  9000,
  "Negative port from environment should fall back to CLI flag"
);

// Test results
console.log(`\nTest Results: ${passCount}/${testCount} passed`);

if (passCount === testCount) {
  console.log("🎉 All tests passed!");
  process.exit(0);
} else {
  console.log("💥 Some tests failed!");
  process.exit(1);
}
