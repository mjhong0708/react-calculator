import { useState } from "react";

import {
  applyOperator,
  appendDecimal,
  appendDigit,
  clearLast,
  clearAll,
  changeSign,
  applyPercentage,
  evaluateExpression,
  isError,
  getErrorMessage,
} from "./lib/calculator";
import { isOperator, OperatorLabels } from "./lib/types";
import { cn } from "./lib/util";

interface Button {
  id: string;
  label: string;
  handler: (tokens: string[]) => string[];
}

const buttons: Button[] = [
  { id: "fn_clear", label: "C", handler: clearLast },
  { id: "fn_allclear", label: "AC", handler: clearAll },
  { id: "fn_percentage", label: "%", handler: applyPercentage },
  { id: "op_divide", label: "÷", handler: applyOperator("DIV") },
  { id: "digit_7", label: "7", handler: appendDigit(7) },
  { id: "digit_8", label: "8", handler: appendDigit(8) },
  { id: "digit_9", label: "9", handler: appendDigit(9) },
  { id: "op_multiply", label: "×", handler: applyOperator("MUL") },
  { id: "digit_4", label: "4", handler: appendDigit(4) },
  { id: "digit_5", label: "5", handler: appendDigit(5) },
  { id: "digit_6", label: "6", handler: appendDigit(6) },
  { id: "op_subtract", label: "-", handler: applyOperator("SUB") },
  { id: "digit_1", label: "1", handler: appendDigit(1) },
  { id: "digit_2", label: "2", handler: appendDigit(2) },
  { id: "digit_3", label: "3", handler: appendDigit(3) },
  { id: "op_add", label: "+", handler: applyOperator("ADD") },
  { id: "fn_change_sign", label: "+/-", handler: changeSign },
  { id: "digit_0", label: "0", handler: appendDigit(0) },
  { id: "fn_decimal", label: ".", handler: appendDecimal },
  { id: "fn_equals", label: "=", handler: evaluateExpression },
];

const isDigitLike = (id: string) =>
  id.startsWith("digit_") || id === "fn_decimal" || id === "fn_change_sign";

function renderInputTokens(tokens: string[]): string {
  if (tokens.length === 0) {
    return "0";
  }
  if (tokens[0] === ".") {
    tokens = ["0", ...tokens];
  }
  const applyLabel = (token: string): string => {
    if (isOperator(token)) {
      return OperatorLabels[token];
    }
    return token;
  };

  return tokens.map(applyLabel).join(" ");
}

function Calculator() {
  const [inputTokens, setInputTokens] = useState<string[]>([]);
  const error = isError(inputTokens);
  const displayText = error ? getErrorMessage(inputTokens) : renderInputTokens(inputTokens);

  return (
    <div className="mx-auto flex w-sm flex-col gap-4 rounded bg-white p-4 shadow">
      <div
        className={cn(
          "rounded border px-3 py-2 text-right text-2xl",
          error ? "border-red-400 text-red-500" : "border-gray-300",
        )}
      >
        {displayText}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((button) => (
          <button
            key={button.id}
            className={cn(
              "cursor-pointer rounded px-2 py-3 text-xl",
              isDigitLike(button.id)
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-blue-100 hover:bg-blue-200",
            )}
            onClick={() => setInputTokens((t) => (error ? [] : button.handler(t)))}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Calculator />
    </main>
  );
}

export default App;
