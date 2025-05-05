import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";

module {
  public type BookingsDetail = HashMap.HashMap<Text, Booking>;
  public type UserBalances = HashMap.HashMap<Principal, UserBalance>;

  public type UserBalance = {
    id : Principal;
    balance : Nat;
  };

  public type Booking = {
    id : Text;
    arenaId : Text;
    fieldId : Text;
    startTime : Text;
    endTime : Text;
    customerId : Principal;
  };

  public type TxStatus = {
    #pending;
    #completed;
    #failed;
  };
};
