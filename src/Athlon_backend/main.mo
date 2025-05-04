import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

// TYPES
import UserType "types/UserType";
import ArenaType "types/ArenaType";
import FieldType "types/FieldType";

// SERVICES
import UserService "services/UserService";
import ArenaService "services/ArenaService";
import FieldService "services/FieldService";


actor Athlon {
  // DATA
  private var users : UserType.Users = HashMap.HashMap<Principal, UserType.User>(
    10,
    Principal.equal,
    Principal.hash
  );
  
  private var arenas : ArenaType.Arenas = HashMap.HashMap<Text, ArenaType.Arena>(
    0,
    Text.equal,
    Text.hash
  );
  var nextArenaId : Nat = 0;

  private var fields : FieldType.Fields = HashMap.HashMap<Text, FieldType.Field>(
    0,
    Text.equal,
    Text.hash
  );
  var nextFieldId : Nat = 0;
  

  // DATA ENTRIES
  private stable var usersEntries : [(Principal, UserType.User)] = [];
  private stable var arenasEntries : [(Text, ArenaType.Arena)] = [];

  // PREUPGRADE & POSTUPGRADE FUNC TO KEEP DATA
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    arenasEntries := Iter.toArray(arenas.entries());
  };
  
  system func postupgrade() {
    users := HashMap.fromIter<Principal, UserType.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
    arenas := HashMap.fromIter<Text, ArenaType.Arena>(arenasEntries.vals(), 0, Text.equal, Text.hash);
    arenasEntries := [];
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
    description: Text,
    images: [Text],
    sports: [Text],
    province: Text,
    city: Text,
    district: Text,
    mapsLink: Text,
    rules: Text,
    facilities: [Text],
    owner: Principal
  ): async ArenaType.Arena {
    let arena = await ArenaService.createArena(
      name,
      description,
      images,
      sports,
      province,
      city,
      district,
      mapsLink,
      rules,
      facilities,
      owner,
      arenas
    );
    nextArenaId += 1;
    return arena;
  };

  public query func getArenaById(id: Text): async ?ArenaType.Arena {
  let values = arenas.vals();
  for (arena in values) {
    if (arena.id == id) {
      return ?arena;
    };
  };
  return null;
};

  public query func getArenaByOwner(id: Text): async ?ArenaType.Arena {
    return arenas.get(id);
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

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION FIELD ------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------

  // public func createField(
  //   id: Nat,
  //   arenaId: Nat,
  //   name: Text,
  //   sportType: Text,
  //   size: Text,
  //   price: Nat,
  //   priceUnit: Text,
  //   availableTimes: [Text],
  //   owner: Principal,
  //   fields: FieldType.Fields
  // )
};
