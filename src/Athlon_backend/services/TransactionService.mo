import UserBalanceType "../types/UserBalanceType";
import Result "mo:base/Result";

import IcpLedger "canister:icp_ledger_canister";


module{
    public func updateUserBalanceFromLedger(userId: Principal, userBalances: UserBalanceType.UserBalances) : async UserBalanceType.UserBalance {
        let ledgerBalance = await IcpLedger.icrc1_balance_of({
            owner = userId;
            subaccount = null;
        });

        let balance : UserBalanceType.UserBalance = {
            id = userId;
            balance = ledgerBalance;
        };

        userBalances.put(userId, balance);
        return balance;
    };

    public func getUserBalance(userId: Principal, userBalances: UserBalanceType.UserBalances) : async Nat {
        switch (userBalances.get(userId)) {
            case (?data) return data.balance;
            case (_) return 0;
        }
    };

    public func transferBalance(
        from: Principal,
        to: Principal,
        amount: Nat,
        userBalances: UserBalanceType.UserBalances
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