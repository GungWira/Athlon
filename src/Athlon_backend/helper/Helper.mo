import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";


module {
    public func generateUUID(userPrincipal : Principal, content : Text) : Text {
    let principalText = Principal.toText(userPrincipal);
    let timestamp = Int.toText(Time.now());
    let contentHash = Nat32.toText(Text.hash(content));

    let combined = principalText # timestamp # contentHash;
    let finalHash = Text.hash(combined);
    return Nat32.toText(finalHash);
  };

  public func any<T>(arr: [T], pred: (T) -> Bool): Bool {
    for (item in arr.vals()) {
      if (pred(item)) {
        return true;
      }
    };
    return false;
  };

  public func contains<T>(arr: [T], item: T, eq: (T, T) -> Bool) : Bool {
    for (val in arr.vals()) {
      if (eq(val, item)) {
        return true;
      }
    };
    return false;
  };


}