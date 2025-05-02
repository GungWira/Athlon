import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
    public type Arenas = HashMap.HashMap<Principal, Arena>;

    public type Arena = {
        id: Nat;
        name: Text;
        location: Text;
        sportTypes: [Text];
        description: Text;
        image: Text;
        createdAt: Int;
        owner: Principal;
    };
}
