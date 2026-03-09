import { isOperator, type Operator } from "./types";

type ComputableToken = number | Operator;

const OperatorInfo = {
  ADD: { precedence: 1, isRightAssociative: false, call: (a: number, b: number) => a + b },
  SUB: { precedence: 1, isRightAssociative: false, call: (a: number, b: number) => a - b },
  MUL: { precedence: 2, isRightAssociative: false, call: (a: number, b: number) => a * b },
  DIV: {
    precedence: 2,
    isRightAssociative: false,
    call: (a: number, b: number) => {
      if (b === 0) throw new Error("Division by zero");
      return a / b;
    },
  },
};

const infixToPostFix = (tokens: readonly string[]): ComputableToken[] => {
  const stack: (Operator | "(" | ")")[] = [];
  const result: ComputableToken[] = [];

  const getPrec = (op: Operator) => OperatorInfo[op].precedence;
  const isRightAssociative = (op: Operator) => OperatorInfo[op].isRightAssociative;

  tokens.forEach((token: string) => {
    switch (token) {
      case "(":
        stack.push(token);
        break;
      case ")":
        while (stack.length && stack.at(-1) !== "(") {
          result.push(stack.pop()! as Operator); // can assert Operator
        }
        stack.pop(); // Remove the "(" from stack
        break;
      default:
        if (isOperator(token)) {
          while (stack.length) {
            const top = stack.at(-1);
            if (!isOperator(top)) break;
            if (
              getPrec(top) > getPrec(token) ||
              (!isRightAssociative(token) && getPrec(top) === getPrec(token))
            ) {
              result.push(stack.pop()! as Operator); // can assert Operator
            } else {
              break;
            }
          }
          stack.push(token);
        } else {
          result.push(Number(token)); // can assert number
        }
    }
  });

  while (stack.length) {
    result.push(stack.pop()! as Operator); // can assert Operator
  }
  console.debug("Postfix expression:", result);
  return result;
};

export const evaluateTokens = (tokens: readonly string[]): number => {
  // Ignore trailing operator
  const last = tokens.at(-1);
  if (typeof last === "string" && isOperator(last)) {
    tokens = tokens.slice(0, -1);
  }
  const postfix = infixToPostFix(tokens);

  const stack: number[] = [];
  postfix.forEach((token) => {
    if (typeof token === "string" && isOperator(token)) {
      if (stack.length < 2) {
        throw new Error("Invalid expression: insufficient operands");
      }
      const b = stack.pop()!;
      const a = stack.pop()!;
      // console.log("Applying operator:", token, "to operands:", a, b);
      const result = OperatorInfo[token].call(a, b);
      stack.push(result);
    } else {
      stack.push(token);
    }
  });
  console.debug("Postfix evaluation result:", stack);
  return stack.pop()!;
};
