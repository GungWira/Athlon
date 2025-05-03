import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

// TYPES
import UserType "types/UserType";
import ArenaType "types/ArenaType";
// SERVICES
import UserService "services/UserService";
import ArenaService "services/ArenaService";


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
  var nextArenaId : Nat = 0;
  

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
    username: Text, 
    imageProfile: ?Text,
    userType: Text, 
    walletAddress: Text,
    phoneNumber: Text,
    arenas: ?[Nat],
    preferedSports: ?[Text],
    ) : async UserType.User {
        return await UserService.createUser(principal, username, imageProfile, userType, walletAddress, phoneNumber, arenas, preferedSports, users);
  };

  public func getUserById(principal: Principal): async ?UserType.User{
    return await UserService.getUser(principal, users);
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION ARENAS -----------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------

  public func createArena(
        name: Text,
        location: Text,
        sportTypes: [Text],
        description: Text,
        image: Text,
        owner: Principal,
    ): async ArenaType.Arena {
        let newArena = await ArenaService.createArena(nextArenaId, name, location, sportTypes, description, image, owner, arenas);
        nextArenaId := nextArenaId + 1;
        return newArena;
    };
  
  public func getAllArenas(): async [ArenaType.Arena] {
      return Iter.toArray(arenas.vals());
  };

  public func searchArenas(
    nameFilter: ?Text,
    locationFilter: ?Text,
    sportFilter: ?Text
  ): async [ArenaType.Arena] {
      return await ArenaService.searchArenas(arenas, nameFilter, locationFilter, sportFilter);
  }

};
