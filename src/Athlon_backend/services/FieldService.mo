

import FieldType "../types/FieldType";

import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import GenerateUuid "../helper/generateUUID";


module {
  public func createField(
    arenaId: Text,
    name: Text,
    sportType: Text,
    size: Text,
    price: Nat,
    priceUnit: Text,
    availableTimes: [Text],
    owner: Principal,
    fields: FieldType.Fields
  ): async FieldType.Field {
    let createdAt = Time.now();

    let id = GenerateUuid.generateUUID(owner, name);

    let field: FieldType.Field = {
      id = id;
      arenaId = arenaId;
      name = name;
      sportType = sportType;
      size = size;
      price = price;
      priceUnit = priceUnit;
      owner = owner;
      createdAt = createdAt;
      availableTimes = availableTimes;
    };
    fields.put(id, field);
    return field;
  };

//   public func getFieldsByArenaId(arenaId: Nat, fields: FieldType.Fields): [FieldType.Field] {
//     fields.vals()
//     |> Array.filter<FieldType.Field>(func(f) = f.arenaId == arenaId)
//   };

//   public func bookTimeSlot(
//     fieldId: Nat,
//     timeSlot: Text,
//     user: Principal,
//     bookings: Bookings
//   ): async Result.Result<(), Text> {
//     let today = getTodayDate();
//     let key = (fieldId, timeSlot, today);
//     switch (bookings.get(key)) {
//       case (null) {
//         bookings.put(key, user);
//         #ok
//       };
//       case (_) { #err("Slot sudah dibooking.") };
//     }
//   };

//   public func getBookingsForFieldToday(
//     fieldId: Nat,
//     bookings: Bookings
//   ): [(Text, Principal)] {
//     let today = getTodayDate();
//     bookings.entries()
//     |> Array.filter<((Nat, Text, Int), Principal)>(
//         func(((fid, time, date), _)) = fid == fieldId and date == today
//       )
//     |> Array.map(func(((fid, time, date), user)) = (time, user))
//   };

//   func getTodayDate(): Int {
//     let now = Time.now();
//     let secondsInDay = 86_400_000_000_000;
//     now / secondsInDay
//   }
}
