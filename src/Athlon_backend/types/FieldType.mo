import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";

module {
  public type Fields = HashMap.HashMap<Text, Field>;

  public type Field = {
    id: Text;
    arenaId: Text;
    name: Text;
    sportType: Text;
    size: Text;
    price: Nat;
    priceUnit: Text;
    owner: Principal;
    availableTimes: [Text]; 
  };
}
