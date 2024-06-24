import { getTokens } from "@/services/tokenService";
import { Token } from "@/types";
import { ArrowUpDown } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NumberFormatBase } from "react-number-format";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const SwapForm: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTokens().then(setTokens).catch(console.error);
  }, []);

  const exchangeRate = useMemo(() => {
    if (fromToken && toToken) {
      const from = tokens.find((t) => t.symbol === fromToken);
      const to = tokens.find((t) => t.symbol === toToken);
      console.log(from)
      console.log(to)
      if (from && to) {
        return from.price / to.price;
      }
    }
    return 0;
  }, [fromToken, toToken, tokens]);

  const availableToTokens = useMemo(
    () => tokens.filter((token) => token.symbol !== fromToken),
    [tokens, fromToken]
  );

  const handleTokenChange = useCallback(
    (type: "from" | "to") => (value: string) => {
      if (type === "from") {
        setFromToken(value);
        if (value === toToken) setToToken("");
      } else {
        setToToken(value);
        if (value === fromToken) setFromToken("");
      }
      setError(null);
    },
    [fromToken, toToken]
  );

  const handleAmountChange = useCallback((values: { value: string }) => {
    setAmount(values.value);
    setError(null);
  }, []);

  const handleSwap = useCallback(() => {
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    console.log("Swapping", amount, fromToken, "to", toToken);
    // Implement actual swap logic here
  }, [amount, fromToken, toToken]);

  const swapDisabled = !fromToken || !toToken || !amount;

  const renderTokenOption = useCallback(
    (token: Token) => (
      <SelectItem key={token.symbol} value={token.symbol}>
        <div className="flex items-center">
          <img
            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.symbol}.svg`}
            alt={token.name}
            className="w-5 h-5 mr-2"
          />
          {token.symbol}
        </div>
      </SelectItem>
    ),
    []
  );

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Currency Swap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={handleTokenChange("from")} value={fromToken}>
            <SelectTrigger>
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>{tokens.map(renderTokenOption)}</SelectContent>
          </Select>

          <NumberFormatBase
            customInput={Input}
            value={amount}
            onValueChange={handleAmountChange}
            placeholder="Amount"
          />

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setFromToken(toToken);
                setToToken(fromToken);
              }}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <Select onValueChange={handleTokenChange("to")} value={toToken}>
            <SelectTrigger>
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {availableToTokens.map(renderTokenOption)}
            </SelectContent>
          </Select>

          {exchangeRate > 0 && (
            <div className="text-sm">
              <p>
                Exchange Rate: 1 {fromToken} = {exchangeRate.toFixed(8)}{" "}
                {toToken}
              </p>
              <p>
                You will receive: {(Number(amount) * exchangeRate).toFixed(8)}{" "}
                {toToken}
              </p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            className="w-full"
            onClick={handleSwap}
            disabled={swapDisabled}
          >
            Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwapForm;
