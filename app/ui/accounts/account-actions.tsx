"use client";

import { Account } from "@/app/lib/accounts/types";
import UpdateAccountDialog from "./update-account-dialog";
import DeleteAccountDialog from "./delete-account-dialog";

export default function AccountActions({ account }: { account: Account }) {
  return (
    <div className="flex justify-center">
      <UpdateAccountDialog account={account} />
      <DeleteAccountDialog account={account} />
    </div>
  );
}
