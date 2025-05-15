import ArenaType "ArenaType";
import BookingType "BookingType";
import CommunityType "CommunityType";
import EventType "EventType";


module{
    public type OwnerDashboard = {
        arenas : [ArenaType.Arena];
        bookings : [BookingType.Booking];
        balance : Nat;
        communities : [CommunityType.Community];
    };

    public type CustomerDashboard = {
        bookings : [CustomerBookingDetail];
        communities : [CommunityType.Community];
        events : [EventType.Event];
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