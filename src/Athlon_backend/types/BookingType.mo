import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";

module {
  public type Bookings = HashMap.HashMap<Text, Booking>;

  public type Booking = {
    id : Text;
    user : Principal;
    fieldId : Text;
    arenaId : Text;
    timestamp : [Text];
    totalPrice : Nat;
    status : Text; // pending | confirmed | canceled | completed
    date : Text;
    createdAt : Int;
  };
}