import ArenaType "ArenaType";
import BookingType "BookingType";


module{
    public type OwnerDashboard = {
        id : Principal;
        arenas : [ArenaType.Arena];
        bookings : [BookingType.Booking];
        balance : Nat;
    }
}