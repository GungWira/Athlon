import Principal "mo:base/Principal";
import Time "mo:base/Time";

import UserType "../types/UserType";

module {
    public func createUser(principal: Principal, name: Text, email: Text, userType: Text, users : UserType.Users) : async UserType.User {
        let createdAt = Time.now();
        let newUser : UserType.User = {
            principal = principal;
            name = name;
            email = email;
            userType = userType;
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