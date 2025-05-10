import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

import FieldType "../types/FieldType";
import BookingType "../types/BookingType";
import UserBalanceType "../types/UserBalanceType";

import Helper "../helper/Helper";
import TransactionService "TransactionService";
import ArenaType "../types/ArenaType";

module {
  public func bookField(
    arenaId : Text,
    fieldId : Text,
    times : [Text],
    user : Principal,
    customerName : Text,
    owner : Principal,
    arenas : ArenaType.Arenas,
    fields : FieldType.Fields,
    balances : UserBalanceType.UserBalances,
    bookings : BookingType.Bookings,
    date : Text
  ) : async Result.Result<Text, Text> {

    let maybeArena = arenas.get(arenaId);
    switch(maybeArena) {
        case null return #err("Arena tidak ditemukan");
        case (?arena){
            let maybeField = fields.get(fieldId);
        switch (maybeField) {
        case null return #err("Field tidak ditemukan");
        case (?field) {
            let pricePerSlot = field.price; 
            let totalPrice = pricePerSlot * times.size();

            let transfer = await TransactionService.transferBalance(user, owner, totalPrice, balances);

            switch (transfer) {
                case (#err(msg)) {
                    return #err("Gagal melakukan pembayaran: " # msg);
                };
                case (#ok(_successMsg)) {
                    // Simpan booking
                    let createdAt = Time.now();
                    let bookingId = Helper.generateUUID(user, date);

                    let newBooking : BookingType.Booking = {
                        id = bookingId;
                        user = user;
                        customerName = customerName;
                        owner = owner;
                        fieldId = fieldId;
                        fieldName = field.name;
                        arenaId = arenaId;
                        arenaName = arena.name;
                        timestamp = times;
                        totalPrice = totalPrice;
                        status = "confirmed";
                        date = date;
                        createdAt = createdAt;
                    };
                    bookings.put(bookingId, newBooking);

                    return #ok("Booking berhasil");
                    };
                };
            };
            };
        };
    };
  };

};
