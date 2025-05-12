import ArenaType "ArenaType";
import BookingType "BookingType";


module{
    public type OwnerDashboard = {
        arenas : [ArenaType.Arena];
        bookings : [BookingType.Booking];
        balance : Nat;
    };

    public type CustomerDashboard = {
        bookings : [CustomerBookingDetail];
    };

    public type CustomerBookingDetail = {
        id : Text;
        user : Principal;
        owner : Principal;
        arenaID : Text;
        arenaName : Text;
        fieldName : Text;
        timestamp : [Text];
        totalPrice : Nat;
        status : Text; // pending | confirmed | canceled | completed
        date : Text;
        createdAt : Int;
    };
}