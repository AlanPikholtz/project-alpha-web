"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { useGetAccountsQuery } from "../lib/accounts/api";
import { Account } from "../lib/accounts/types";

type AccountContextType = {
  accounts: Account[];
  loadingAccounts: boolean;
  selectedAccountId: number | null;
  setSelectedAccountId: (accountId: number) => void;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccountId = () => {
  const context = useContext(AccountContext);
  if (!context)
    throw new Error("useAccount must be used within AccountProvider");
  return context;
};

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { data: accounts, isLoading: loadingAccounts } = useGetAccountsQuery(
    {}
  );
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      accounts: accounts?.data || [],
      loadingAccounts: loadingAccounts,
      selectedAccountId,
      setSelectedAccountId,
    }),
    [accounts?.data, loadingAccounts, selectedAccountId]
  );

  return (
    <AccountContext.Provider value={contextValue}>
      {children}
    </AccountContext.Provider>
  );
};
