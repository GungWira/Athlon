import TransactionType "../types/TransactionType";
import IcpLedger "canister:icp_ledger_canister";

module {
//   private func manageUserBalance(
//     userBalances : TransactionType.UserBalances,
//     userId : Principal,
//     amount : Nat,
//     operation : { #increment; #decrement },
//   ) : Result.Result<(), Text> {
//     let balance = userBalances.get(userId);

//     switch (operation) {
//       case (#decrement) {
//         switch (balance) {
//           case (null) return #err("No balance found");
//           case (?b) {
//             if (b.balance < amount) return #err("Insufficient balance");
//             userBalances.put(userId, { id = userId; balance = b.balance - amount });
//             #ok();
//           };
//         };
//       };
//       case (#increment) {
//         let newBalance = switch (balance) {
//           case (null) amount;
//           case (?b) b.balance + amount;
//         };
//         userBalances.put(userId, { id = userId; balance = newBalance });
//         #ok();
//       };
//     };
//   };

  public func handleGetAccountBalance(userId : Principal, userBalances : TransactionType.UserBalances) : async TransactionType.UserBalance {
    let ledgerBalance = await IcpLedger.icrc1_balance_of({
      owner = userId;
      subaccount = null;
    });

    let userBalance : TransactionType.UserBalance = {
      id = userId;
      balance = ledgerBalance;
    };

    userBalances.put(userId, userBalance);
    return userBalance;
  };

//   private func transfer(amount : Nat64, to : Principal) : async Result.Result<ledger.BlockIndex, Text> {
//     try {
//       let accountIdentifier = await IcpLedger.account_identifier({
//         owner = to;
//         subaccount = null;
//       });

//       let transferArgs = {
//         to = accountIdentifier;
//         memo = 0;
//         amount = { e8s = amount };
//         fee = { e8s = 10_000 };
//         from_subaccount = null;
//         created_at_time = null;
//       };

//       switch (await IcpLedger.transfer(transferArgs)) {
//         case (#Ok(blockIndex)) #ok(blockIndex);
//         case (#Err(transferError)) #err("Transfer failed: " # debug_show (transferError));
//       };
//     } catch (error) {
//       #err("Transaction error: " # Error.message(error));
//     };
//   };

//   public func bookAField(
//     userId : Principal,
//     arenaId : Text,
//     startTime : Text,
//     endTime : Text,
//     fieldId : Text,
//     userBalances : TransactionType.UserBalances,
//     arena : ArenaType.Arenas,
//     bookingStatus : TransactionType.BookingsDetail,
//   ) : async Result.Result<TransactionType.Booking, Text> {
//     switch (arenas.get(arenaId)) {
//       case (null) return #err("Arena not found");
//       case (?arena) {
//         let balance = await handleGetAccountBalance(userId, userBalances);
//         if (balance.balance < arena.price) return #err("Insufficient balance");

//         switch (bookingStatus.get(arenaId)) {
//           case (?booked) {
//             if (booked.startTime == startTime and booked.endTime == endTime and booked.fieldId == fieldId) {
//               return #err("Time slot already booked");
//             };
//           };
//           case (null) {
//             switch (await transfer(Nat64.fromNat(arena.price), arena.ownerId)) {
//               case (#ok(_)) {
//                 let id = GenerateUuid.generateUUID(owner, description);
//                 let data = {
//                   id = id;
//                   arenaId = arenaId;
//                   fieldId = fieldId;
//                   startTime = startTime;
//                   endTime = endTime;
//                   customerId = userId;
//                 }
//                 bookingStatus.put(
//                   arenaId,
//                   data
//                 );

//                 return #ok(data);
//               };
//               case (#err(msg)) return #err(msg);
//             };
//           };
//         };
//       };
//     };
//     #err("Booking failed");
//   };
};
