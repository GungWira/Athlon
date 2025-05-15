import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

import UserType "../types/UserType";

import TransactionService "TransactionService";
import UserBalanceType "../types/UserBalanceType";

module {
    public func createUser(
        principal : Principal,
        username : Text,
        imageProfile : ?Text,
        userType : Text,
        walletAddress : Text,
        phoneNumber : Text,
        arenas : ?[Nat],
        preferedSports : ?[Text],
        users : UserType.Users,
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
            isPremium = false;
            endPremiumDate = 0;
        };

        users.put(principal, newUser);
        return newUser;
    };

    // Get user by Principal
    public func getUser(principal : Principal, users : UserType.Users) : async ?UserType.User {
        return users.get(principal);
    };


    // Set User to be premium User
    public func setUserPremium(principal : Principal, users : UserType.Users, canisterPrincipal : Principal, amount : Nat, userBalances : UserBalanceType.UserBalances) : async ?UserType.User {
        let user = users.get(principal);

        // Check if user is already premium
        let transferResult = await TransactionService.transferBalance(principal, canisterPrincipal, amount, userBalances);
        switch (user) {
            case (null) { return null };
            case (?u) {
                if (u.isPremium) {
                    return null; // User is already premium
                };
            };
        };
        // Check if transfer was successful
        switch (transferResult) {
            case (#err(_)) { return null };
            case (#ok(_)) {
                switch (user) {
                    case (null) { return null };
                    case (?u) {
                        let updatedUser = {
                            u with
                            isPremium = true;
                            endPremiumDate = Time.now() + 30 * 24 * 60 * 60; // 30 days from now
                        };
                        users.put(principal, updatedUser);
                        return ?updatedUser;
                    };
                };
            };
        };
    };
};

    public func updateProfile(principal : Principal, username : Text, phone : Text, imageProfile : Text, users : UserType.Users) : async ?UserType.User {
        switch (users.get(principal)) {
            case (?user) {
                let updatedUser : UserType.User = {
                    principal = principal;
                    username = username;
                    imageProfile = ?imageProfile;
                    userType = user.userType;
                    walletAddress = user.walletAddress;
                    phoneNumber = phone;
                    arenas = user.arenas;
                    preferedSports = user.preferedSports;
                    createdAt = user.createdAt;
                };

                users.put(principal, updatedUser);
                return ?updatedUser;
            };
            case null {
                return null;
            };
        }
    };

}

