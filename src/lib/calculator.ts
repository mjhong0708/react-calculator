import { evaluateTokens } from "./core";
import { isNumber, isOperator, type Operator } from "./types";

// Numbers
export const appendDigit = (value: number) => (tokens: string[]) => {
  const lastToken = tokens[tokens.length - 1];
  if (isNumber(lastToken)) {
    return [...tokens.slice(0, -1), `${lastToken}${value}`];
  } else if (isOperator(lastToken) || lastToken === undefined) {
    return [...tokens, String(value)];
  }

  console.debug("Unknown token state when appending digit:", tokens);
  return tokens;
};

export const appendDecimal = (tokens: string[]) => {
  const lastToken = tokens[tokens.length - 1];
  if (lastToken === undefined || isOperator(lastToken)) {
    return [...tokens, "0."]; // Start a new decimal number
  }

  if (lastToken.includes(".")) {
    return tokens; // Prevent multiple decimals
  }

  if (isNumber(lastToken)) {
    return [...tokens.slice(0, -1), `${lastToken}.`];
  }
  console.debug("Unknown token state when appending decimal:", tokens);
  return tokens;
};

// Operators
export const applyOperator = (operator: Operator) => (tokens: string[]) => {
  const lastToken = tokens[tokens.length - 1];
  if (isOperator(lastToken)) {
    return [...tokens.slice(0, -1), operator];
  }
  if (isNumber(lastToken)) {
    return [...tokens, operator];
  }
  if (lastToken === undefined) {
    return [...tokens, "0", operator];
  }
  console.debug("Unknown token state when applying operator:", tokens);
  return tokens;
};

export const changeSign = (tokens: string[]) => {
  const lastToken = tokens[tokens.length - 1];
  if (isNumber(lastToken)) {
    if (lastToken.startsWith("-")) {
      return [...tokens.slice(0, -1), lastToken.slice(1)];
    } else {
      return [...tokens.slice(0, -1), `-${lastToken}`];
    }
  }
  // Do nothing if the last token is not a number
  return tokens;
};

export const applyPercentage = (tokens: string[]) => {
  const last = tokens[tokens.length - 1];
  if (!isNumber(last)) return tokens;
  const op = tokens[tokens.length - 2];
  const base = tokens[tokens.length - 3];
  if ((op === "ADD" || op === "SUB") && isNumber(base)) {
    return [...tokens.slice(0, -1), String((Number(base) * Number(last)) / 100)];
  }
  return [...tokens.slice(0, -1), String(Number(last) / 100)];
};

// Functions
export const clearLast = (tokens: string[]) => {
  const lastToken = tokens[tokens.length - 1];
  if (lastToken === undefined) {
    return tokens;
  }
  if (isOperator(lastToken)) {
    return tokens.slice(0, -1);
  } else {
    // Remove the last digit from the last token
    const newToken = lastToken.slice(0, -1);
    if (newToken === "") {
      return tokens.slice(0, -1);
    } else {
      return [...tokens.slice(0, -1), newToken];
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clearAll = (_tokens: string[]): string[] => [];

export const ERROR_TOKEN = "__ERROR__";

export const isError = (tokens: string[]) => tokens[0] === ERROR_TOKEN;

export const getErrorMessage = (tokens: string[]) => tokens[1] ?? "Unknown error";

export const evaluateExpression = (tokens: string[]) => {
  try {
    const ans = evaluateTokens(tokens);
    return [String(ans)];
  } catch (e) {
    console.debug("Evaluation error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return [ERROR_TOKEN, message];
  }
};
