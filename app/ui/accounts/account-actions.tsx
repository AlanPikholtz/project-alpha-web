"use client";

import { Account } from "@/app/lib/accounts/types";
import UpdateAccountDialog from "./update-account-dialog";
import DeleteAccountDialog from "./delete-account-dialog";

interface AccountActionsProps {
  account: Account;
  onOptimisticUpdate?: (
    id: number | string,
    updater: (item: Account) => Account
  ) => void;
  onOptimisticDelete?: (id: number | string) => void;
  onError?: () => Promise<void>;
}

export default function AccountActions({
  account,
  onOptimisticUpdate,
  onOptimisticDelete,
  onError,
}: AccountActionsProps) {
  return (
    <div className="flex justify-center">
      <UpdateAccountDialog
        account={account}
        onOptimisticUpdate={onOptimisticUpdate}
        onError={onError}
      />
      <DeleteAccountDialog
        account={account}
        onOptimisticDelete={onOptimisticDelete}
      />
    </div>
  );
}
