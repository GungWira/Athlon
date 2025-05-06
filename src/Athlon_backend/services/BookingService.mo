import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

import FieldType "../types/FieldType";
import BookingType "../types/BookingType";
import UserBalanceType "../types/UserBalanceType";

import GenerateUuid "../helper/generateUUID";
import TransactionService "TransactionService";

module {
  public func bookField(
    arenaId : Text,
    fieldId : Text,
    times : [Text],
    user : Principal,
    owner : Principal,
    fields : FieldType.Fields,
    balances : UserBalanceType.UserBalances,
    bookings : BookingType.Bookings,
    date : Text
) : async Result.Result<Text, Text> {

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
                    let bookingId = GenerateUuid.generateUUID(user, date);

                    let newBooking : BookingType.Booking = {
                        id = bookingId;
                        user = user;
                        owner = owner;
                        fieldId = fieldId;
                        arenaId = arenaId;
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
