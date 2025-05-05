import TransactionType "../types/TransactionType";
import Result "mo:base/Result";

import IcpLedger "canister:icp_ledger_canister";


module{
    public func updateUserBalanceFromLedger(userId: Principal, userBalances: TransactionType.UserBalances) : async TransactionType.UserBalance {
        let ledgerBalance = await IcpLedger.icrc1_balance_of({
            owner = userId;
            subaccount = null;
        });

        let balance : TransactionType.UserBalance = {
            id = userId;
            balance = ledgerBalance;
        };

        userBalances.put(userId, balance);
        return balance;
    };

    public func getUserBalance(userId: Principal, userBalances: TransactionType.UserBalances) : async Nat {
        switch (userBalances.get(userId)) {
            case (?data) return data.balance;
            case (_) return 0;
        }
    };

    public func transferBalance(
        from: Principal,
        to: Principal,
        amount: Nat,
        userBalances: TransactionType.UserBalances
    ) : async Result.Result<Text, Text> {
        let senderBalance = await getUserBalance(from, userBalances);
        if (senderBalance < amount) {
            return #err("Insufficient balance");
        };

        userBalances.put(from, {
            id = from;
            balance = senderBalance - amount;
        });

        let receiverBalance = await getUserBalance(to, userBalances);
        userBalances.put(to, {
            id = to;
            balance = receiverBalance + amount;
        });

        return #ok("Transfer successful");
    };



}