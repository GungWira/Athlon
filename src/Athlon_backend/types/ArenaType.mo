import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
    public type Arenas = HashMap.HashMap<Principal, Arena>;

    public type Arena = {
        id: Nat;
        name: Text;
        description: Text;
        images: [Text];
        sports: [Text];
        province: Text;
        city: Text;
        district: Text;
        mapsLink: Text;
        rules: Text;
        facilities: [Text];
        createdAt: Int;
        owner: Principal;
    };
}
