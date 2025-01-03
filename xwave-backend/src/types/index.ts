export interface Block {
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  validator?: string;
}

export interface Transaction {
  isValid(): unknown;
  from: any;
  to: any;
  fromAddress: string | null;
  toAddress: string;
  amount: number;
  timestamp: number;
  hash: string;
}

export interface Validator {
  address: string;
  stake: number;
}