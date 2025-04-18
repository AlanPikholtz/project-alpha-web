"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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

  return (
    <AccountContext.Provider
      value={{
        accounts: accounts?.data || [],
        loadingAccounts: loadingAccounts,
        selectedAccountId,
        setSelectedAccountId,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
