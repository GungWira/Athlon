import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";

module {
  public type UserBalances = HashMap.HashMap<Principal, UserBalance>;

  public type UserBalance = {
    id : Principal;
    balance : Nat;
  };
};
