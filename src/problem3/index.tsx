interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const DEFAULT_PRIORITY = -99;

// Spread props
const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = useCallback(
    (blockchain: string): number =>
      BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY,
    []
  );

  // We can combine filter and map into reduce
  const formattedBalances = useMemo(() => {
    return balances
      .reduce<FormattedWalletBalance[]>((acc, balance) => {
        const priority = getPriority(balance.blockchain);
        //The original logic is trying to retain balances with high priority but with amounts equal to 0 or negative, 
        //which seems illogical in the context of a wallet.
        if (priority > DEFAULT_PRIORITY && balance.amount > 0) {
          acc.push({
            ...balance,
            formatted: balance.amount.toFixed(2),
            usdValue: prices[balance.currency] * balance.amount,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
  }, [balances, prices]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance) => (
        <WalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};
