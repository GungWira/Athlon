import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import ArenaType "../types/ArenaType";
import BookingType "../types/BookingType";
import UserBalanceType "../types/UserBalanceType";
import DashboardType "../types/DashboardType";
import FieldType "../types/FieldType";


module{
    public func getOwnerDetailDashboard(
        owner : Principal, 
        arenas : ArenaType.Arenas, 
        bookings : BookingType.Bookings, 
        balances : UserBalanceType.UserBalances
    ) : async Result.Result <DashboardType.OwnerDashboard, Text> {
        // GET ARENA
        let allArena = Iter.toArray(arenas.vals());

        let ownerArenas = Array.filter<ArenaType.Arena>(
        allArena,
        func(a: ArenaType.Arena): Bool {
            a.owner == owner
        }
        );

        let orderedArens = Array.sort<ArenaType.Arena>(
        ownerArenas,
        func(a: ArenaType.Arena, b: ArenaType.Arena): {#less; #greater; #equal} {
            if (a.createdAt > b.createdAt) { #less }
            else if (a.createdAt < b.createdAt) { #greater }
            else { #equal }
        }
        );

        // GET BOOKING
        let allBooking = Iter.toArray(bookings.vals());

        let ownerBooks = Array.filter<BookingType.Booking>(
        allBooking,
        func(b: BookingType.Booking): Bool {
            b.owner == owner
        }
        );

        let orderedBooks = Array.sort<BookingType.Booking>(
        ownerBooks,
        func(a: BookingType.Booking, b: BookingType.Booking): {#less; #greater; #equal} {
            if (a.createdAt > b.createdAt) { #less }
            else if (a.createdAt < b.createdAt) { #greater }
            else { #equal }
        }
        );

        // GET BALANCE
        let ownerBalance = switch(balances.get(owner)){
            case (null) {
                { id = owner; balance = 0 };
            };
            case (?isBalance) isBalance;
        };

        let ownerData : DashboardType.OwnerDashboard = {
            arenas = orderedArens;
            bookings = orderedBooks;
            balance = ownerBalance.balance
        };

        return #ok ownerData;
    };

    public func getCustomerDetailDashboard(
        customer : Principal, 
        bookings : BookingType.Bookings, 
        arenas : ArenaType.Arenas, 
        fields : FieldType.Fields
    ) : async Result.Result <DashboardType.CustomerDashboard, Text> {

        let allBooking = Iter.toArray(bookings.vals());

        let ownerBooks = Array.filter<BookingType.Booking>(
            allBooking,
            func(b: BookingType.Booking): Bool {
                b.user == customer
            }
        );

        let orderedBooks = Array.sort<BookingType.Booking>(
            ownerBooks,
            func(a: BookingType.Booking, b: BookingType.Booking): {#less; #greater; #equal} {
                if (a.createdAt > b.createdAt) { #less }
                else if (a.createdAt < b.createdAt) { #greater }
                else { #equal }
            }
        );

        let mapped = Array.map<BookingType.Booking, DashboardType.CustomerBookingDetail>(
            orderedBooks,
            func(b: BookingType.Booking): DashboardType.CustomerBookingDetail {
                let arenaName = switch (arenas.get(b.arenaId)) {
                    case (?a) a.name;
                    case (_) "Unknown Arena";
                };

                let fieldName = switch (fields.get(b.fieldId)) {
                    case (?f) f.name;
                    case (_) "Unknown Field";
                };

                {
                    id = b.id;
                    user = b.user;
                    owner = b.owner;
                    arenaID = b.arenaId;
                    arenaName = arenaName;
                    fieldName = fieldName;
                    timestamp = b.timestamp;
                    totalPrice = b.totalPrice;
                    status = b.status;
                    date = b.date;
                    createdAt = b.createdAt;
                }
            }
        );

        return #ok {bookings = mapped};
    };
}