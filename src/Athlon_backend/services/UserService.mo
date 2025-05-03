import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";

import UserType "../types/UserType";

module {
    public func createUser(
        principal: Principal, 
        username: Text, 
        imageProfile: ?Text,
        userType: Text, 
        walletAddress: Text,
        phoneNumber: Text,
        arenas: ?[Nat],
        preferedSports: ?[Text],
        users : UserType.Users
        ) : async UserType.User {
        let createdAt = Time.now();
        
        let newUser : UserType.User = {
            principal = principal;
            username = username;
            imageProfile = imageProfile;
            userType = userType;
            walletAddress = walletAddress;
            phoneNumber = phoneNumber;
            arenas = arenas;
            preferedSports = preferedSports;
            createdAt = createdAt;
        };

        users.put(principal, newUser);
        return newUser;
    };

    // Get user by Principal
    public func getUser(principal: Principal, users: UserType.Users) : async ?UserType.User {
        return users.get(principal);
    };
}