export type Operator = "ADD" | "SUB" | "MUL" | "DIV";
export type Function = "CLEAR" | "ALLCLEAR" | "EQUALS" | "PERCENTAGE" | "DECIMAL" | "CHANGE_SIGN";

// Test if the token is a number by regex: allow digits, decimal points, and negative signs
export const isNumber = (token: string | undefined): boolean => {
  return token !== undefined && /^[+-]?(\d+\.?\d*|\d*\.?\d+)$/.test(token);
};

export const isOperator = (token: string | undefined): token is Operator => {
  return token === "ADD" || token === "SUB" || token === "MUL" || token === "DIV";
};

export const isFunction = (token: string | undefined): token is Function => {
  return (
    token === "CLEAR" ||
    token === "ALLCLEAR" ||
    token === "EQUALS" ||
    token === "PERCENTAGE" ||
    token === "DECIMAL" ||
    token === "CHANGE_SIGN"
  );
};

export const OperatorLabels: Record<Operator, string> = {
  ADD: "+",
  SUB: "-",
  MUL: "×",
  DIV: "÷",
};

export const FunctionLabels: Record<Function, string> = {
  CLEAR: "C",
  ALLCLEAR: "AC",
  EQUALS: "=",
  PERCENTAGE: "%",
  DECIMAL: ".",
  CHANGE_SIGN: "+/-",
};  