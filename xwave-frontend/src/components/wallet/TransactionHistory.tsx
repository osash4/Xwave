
// Definir los tipos para las transacciones y los filtros
type Transaction = {
  hash: string;
  type: string;
  amount: number;
};

type Filters = {
  type: string;
  amount: string;
};

// Definir las props del componente con los tipos adecuados
interface TransactionHistoryProps {
  transactions: Transaction[];
  filters: Filters;
}

export function TransactionHistory({ transactions, filters }: TransactionHistoryProps) {
  // Filtrar las transacciones según los filtros proporcionados
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filters.type === 'all' || tx.type === filters.type;
    const matchesAmount =
      filters.amount === 'all' ||
      (filters.amount === 'high' ? tx.amount > 1000 : tx.amount <= 1000);
    return matchesType && matchesAmount;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transaction History</h2>
      <ul className="space-y-2">
        {filteredTransactions.map((tx) => (
          <li key={tx.hash} className="border rounded-lg p-4">
            <div className="text-lg font-semibold">{tx.hash}</div>
            <div>{tx.type}</div>
            <div>{tx.amount}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
