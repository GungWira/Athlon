import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Text "mo:base/Text";

module {
    public type Users = HashMap.HashMap<Principal, User>;


    public type User = {
        principal: Principal;
        name: Text;
        email: Text;
        userType: Text;
        createdAt: Int;
    };
}