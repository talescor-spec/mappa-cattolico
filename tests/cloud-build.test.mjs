import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("../ios/App/ci_scripts/ci_post_clone.sh", import.meta.url));
function prepare(overrides = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "fideora-cloud-"));
  const bin = path.join(root, "bin");
  const project = path.join(root, "ios/App/App.xcodeproj");
  mkdirSync(bin);
  mkdirSync(path.join(project, "project.xcworkspace/xcshareddata/swiftpm"), { recursive: true });
  writeFileSync(path.join(root, "package-lock.json"), "{}");
  writeFileSync(path.join(project, "project.pbxproj"), "fixture");
  writeFileSync(path.join(project, "project.xcworkspace/xcshareddata/swiftpm/Package.resolved"), "{}");
  symlinkSync(process.execPath, path.join(bin, "node"));
  writeFileSync(path.join(bin, "npm"), [
    '#!/bin/sh',
    'printf "%s\\n" "$*" >> "$FIDEORA_TEST_LOG"',
    'if [ "$*" = "${FIDEORA_TEST_FAIL:-}" ]; then exit 23; fi',
    '',
  ].join('\n'), { mode: 0o755 });
  const log = path.join(root, "calls.txt");
  writeFileSync(log, "");
  const result = spawnSync("/bin/sh", [script], {
    env: {
      ...process.env,
      PATH: `${bin}:${process.env.PATH}`,
      CI_XCODE_CLOUD: "TRUE",
      CI_TEAM_ID: "CZ7QKZBQC8",
      CI_BRANCH: "fideora-premium-v1",
      CI_GIT_REF: "",
      CI_PRIMARY_REPOSITORY_PATH: root,
      FIDEORA_TEST_LOG: log,
      ...overrides,
    },
    encoding: "utf8",
  });
  const calls = readFileSync(log, "utf8").trim().split("\n").filter(Boolean);
  rmSync(root, { recursive: true, force: true });
  return { ...result, calls };
}

test("cloud build refuses a different team or branch before preparing a release", () => {
  for (const override of [{ CI_TEAM_ID: "OTHERTEAM" }, { CI_BRANCH: "main" }, { CI_BRANCH: "" }]) {
    const result = prepare(override);
    assert.equal(result.status, 1);
    assert.deepEqual(result.calls, []);
  }
});
test("cloud build accepts the canonical branch reference for a manual run", () => {
  const result = prepare({ CI_BRANCH: "", CI_GIT_REF: "refs/heads/fideora-premium-v1" });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.calls, ["ci --no-audit --no-fund", "test", "run appstore:preflight", "run cap:ios"]);
});
test("a failed test blocks the preflight and iOS assets step", () => {
  const result = prepare({ FIDEORA_TEST_FAIL: "test" });
  assert.equal(result.status, 23);
  assert.deepEqual(result.calls, ["ci --no-audit --no-fund", "test"]);
});
test("a failed preflight blocks the iOS assets step", () => {
  const result = prepare({ FIDEORA_TEST_FAIL: "run appstore:preflight" });
  assert.equal(result.status, 23);
  assert.deepEqual(result.calls, ["ci --no-audit --no-fund", "test", "run appstore:preflight"]);
});
