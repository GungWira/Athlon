import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Text "mo:base/Text";

module {
    public type Users = HashMap.HashMap<Principal, User>;

    public type User = {
        principal: Principal;
        username: Text;
        imageProfile: ?Text;
        userType: Text;
        walletAddress: Text;
        phoneNumber: Text;

        // FOR OWNER
        arenas: ?[Nat];

        // FOR CUSTOMER
        preferedSports: ?[Text];

        createdAt: Int;
    };
}