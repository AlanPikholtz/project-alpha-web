"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AccountContextType = {
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
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  return (
    <AccountContext.Provider
      value={{ selectedAccountId, setSelectedAccountId }}
    >
      {children}
    </AccountContext.Provider>
  );
};
