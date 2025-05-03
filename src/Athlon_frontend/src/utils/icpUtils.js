import { AccountIdentifier } from "@dfinity/ledger-icp";

export function getAccountIdentifierFromPrincipal(principal) {
  const account = AccountIdentifier.fromPrincipal({
    principal,
    subAccount: undefined,
  });
  return account.toHex();
}
