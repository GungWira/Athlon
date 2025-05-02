import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";

// TYPES
import UserType "types/UserType";
import ArenaType "types/ArenaType";
// SERVICES
import UserService "services/UserService";


actor Athlon {
  // DATA
  private var users : UserType.Users = HashMap.HashMap<Principal, UserType.User>(
    10,
    Principal.equal,
    Principal.hash
  );
  
  private var arenas : ArenaType.Arenas = HashMap.HashMap<Principal, ArenaType.Arena>(
    10,
    Principal.equal,
    Principal.hash
  );
  

  // DATA ENTRIES
  private stable var arenasEntries : [(Principal, ArenaType.Arena)] = [];
  private stable var usersEntries : [(Principal, UserType.User)] = [];

  // PREUPGRADE & POSTUPGRADE FUNC TO KEEP DATA
  system func preupgrade() {
    arenasEntries := Iter.toArray(arenas.entries());
    usersEntries := Iter.toArray(users.entries());
  };
  
  system func postupgrade() {
    arenas := HashMap.fromIter<Principal, ArenaType.Arena>(arenasEntries.vals(), 0, Principal.equal, Principal.hash);
    arenasEntries := [];
    users := HashMap.fromIter<Principal, UserType.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION USERS ------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------

  public func createNewUser(
    principal: Principal, 
    name: Text, 
    email: Text, 
    userType: Text
    ) : async UserType.User {
        return await UserService.createUser(principal, name, email, userType, users);
  };

  public func getUserById(principal: Principal): async ?UserType.User{
    return await UserService.getUser(principal, users);
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION ARENAS -----------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------



};
