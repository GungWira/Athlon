import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Bool "mo:base/Bool";

module {
    public type Users = HashMap.HashMap<Principal, User>;

    public type User = {
        principal: Principal;
        username: Text;
        imageProfile: ?Text;
        userType: Text; // owner | customer 
        walletAddress: Text;
        phoneNumber: Text;
        isPremium : Bool;
        endPremiumDate: Int;

        // FOR OWNER
        arenas: ?[Nat];

        // FOR CUSTOMER
        preferedSports: ?[Text];

        createdAt: Int;
    };
}