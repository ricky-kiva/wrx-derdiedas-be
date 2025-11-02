import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

const ignoredPaths = ["/node_modules/", "/build/", "/coverage/"];

/** @type {import("jest").Config} **/
export const testEnvironment = "node";
export const transform = {
  ...tsJestTransformCfg,
};
export const testPathIgnorePatterns = ignoredPaths;
export const coveragePathIgnorePatterns = ignoredPaths;
