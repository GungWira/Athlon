import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Result "mo:base/Result";

// TYPES
import UserType "types/UserType";
import ArenaType "types/ArenaType";
import FieldType "types/FieldType";
import UserBalanceType "types/UserBalanceType";

// SERVICES
import UserService "services/UserService";
import ArenaService "services/ArenaService";
import FieldService "services/FieldService";
import TransactionService "services/TransactionService";
import BookingType "types/BookingType";
import BookingService "services/BookingService";
import DashboardType "types/DashboardType";
import DashboardService "services/DashboardService";


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

  private var fields : FieldType.Fields = HashMap.HashMap<Text, FieldType.Field>(
    0,
    Text.equal,
    Text.hash
  );

  private var userBalances : UserBalanceType.UserBalances = HashMap.HashMap<Principal, UserBalanceType.UserBalance>(
    0,
    Principal.equal,
    Principal.hash
  );
  
  private var bookings : BookingType.Bookings = HashMap.HashMap<Text, BookingType.Booking>(
    0,
    Text.equal,
    Text.hash
  );

  // DATA ENTRIES
  private stable var usersEntries : [(Principal, UserType.User)] = [];
  private stable var arenasEntries : [(Text, ArenaType.Arena)] = [];
  private stable var fieldsEntries : [(Text, FieldType.Field)] = [];
  private stable var userBalancesEntries : [(Principal, UserBalanceType.UserBalance)] = [];
  private stable var bookingsEntries : [(Text, BookingType.Booking)] = [];

  // PREUPGRADE & POSTUPGRADE FUNC TO KEEP DATA
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    arenasEntries := Iter.toArray(arenas.entries());
    fieldsEntries := Iter.toArray(fields.entries());
    userBalancesEntries := Iter.toArray(userBalances.entries());
    bookingsEntries := Iter.toArray(bookings.entries());
  };
  
  system func postupgrade() {
    users := HashMap.fromIter<Principal, UserType.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
    arenas := HashMap.fromIter<Text, ArenaType.Arena>(arenasEntries.vals(), 0, Text.equal, Text.hash);
    arenasEntries := [];
    fields := HashMap.fromIter<Text, FieldType.Field>(fieldsEntries.vals(), 0, Text.equal, Text.hash);
    fieldsEntries := [];
    userBalances := HashMap.fromIter<Principal, UserBalanceType.UserBalance>(userBalancesEntries.vals(), 0, Principal.equal, Principal.hash);
    userBalancesEntries := [];
    bookings := HashMap.fromIter<Text, BookingType.Booking>(bookingsEntries.vals(), 0, Text.equal, Text.hash);
    bookingsEntries := [];
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

  public query func getArenaByOwner(owner: Principal): async ?ArenaType.Arena {
    let values = arenas.vals();
    for (arena in values) {
      if (arena.owner == owner) {
        return ?arena;
      };
    };
    return null;
  };


  public query func getArenasByOwner(owner: Principal): async [ArenaType.Arena] {
    let values = Iter.toArray(arenas.vals());

    let ownedArenas = Array.filter<ArenaType.Arena>(
      values,
      func(a: ArenaType.Arena): Bool {
        a.owner == owner
      }
    );

    let orderedArens = Array.sort<ArenaType.Arena>(
      ownedArenas,
      func(a: ArenaType.Arena, b: ArenaType.Arena): {#less; #greater; #equal} {
        if (a.createdAt > b.createdAt) { #less }
        else if (a.createdAt < b.createdAt) { #greater }
        else { #equal }
      }
    );

    return orderedArens;
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
  };

  public func getArenaBookingDetail(
      arenaId : Text,
      date : Text
  ) : async ?{
      arena : ArenaType.Arena;
      arenaFields : [FieldType.Field];
      bookingDatas : [(Text, [BookingType.Booking])];
  } {
    return await ArenaService.getArenaBookingDetail(arenaId, arenas, fields, bookings, date)
  };

  public func setArenaStatus(
    arenaId : Text,
    status : Text,
  ) : async Result.Result<Text, Text> {
    return await ArenaService.setArenaStatus(arenaId, status, arenas, fields);
  };

  public func getArenaRecommendation(
    userOpt : ?Principal
  ) : async ArenaType.ArenaRecommendation {
    return await ArenaService.getArenaRecommendation(userOpt, users, arenas);
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION FIELD ------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------

  public func createField(
    arenaId: Text,
    name: Text,
    sportType: Text,
    size: Text,
    price: Nat,
    image : Text,
    priceUnit: Text,
    availableTimes: [Text],
    owner: Principal,
  ) : async FieldType.Field {
    let field = await FieldService.createField(
      arenaId,
      name,
      sportType,
      size,
      price,
      priceUnit,
      availableTimes,
      image,
      owner,
      fields
    );
    return field;
  };

  public func getFieldsByArenaId(arenaId: Text): async Result.Result<FieldType.Field, Text> {
    switch (await FieldService.getFieldsByArenaId(arenaId, fields)) {
      case (#ok(field)) { return #ok(field); };
      case (#err(error)) { return #err(error); };
    };
  };

  public query func getFieldsByArena(arenaId: Text): async [FieldType.Field] {
    let values = Iter.toArray(fields.vals());

    let fieldsOnArenas = Array.filter<FieldType.Field>(
      values,
      func(a: FieldType.Field): Bool {
        a.arenaId == arenaId
      }
    );

    let orderedFieldsOnArenas = Array.sort<FieldType.Field>(
      fieldsOnArenas,
      func(a: FieldType.Field, b: FieldType.Field): {#less; #greater; #equal} {
        if (a.createdAt < b.createdAt) { #less }
        else if (a.createdAt > b.createdAt) { #greater }
        else { #equal }
      }
    );

    return orderedFieldsOnArenas;
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION BOOKING ----------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------

  public func bookField(
      arenaId : Text,
      fieldId : Text,
      times : [Text],
      user : Principal,
      customerName : Text,
      owner : Principal,
      date : Text
  ) : async Result.Result<Text, Text> {
    return await BookingService.bookField(arenaId, fieldId, times, user, customerName, owner, arenas, fields, userBalances, bookings, date);
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION WALLET -----------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------

  public func getBalanceLedger(user : Principal) : async UserBalanceType.UserBalance {
    return await TransactionService.updateUserBalanceFromLedger(user, userBalances);
  };

  public func getBalance(user : Principal) : async Nat {
    return await TransactionService.getUserBalance(user, userBalances);
  };

    // ---------------------------------------------------------------------------------------------------------------
    // FUNCTION DASHBOARD --------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------

  public func getDashboardOwner(owner : Principal) : async Result.Result <DashboardType.OwnerDashboard, Text> {
    switch(users.get(owner)){
      case(null) return #err "Data user tidak ditemukan";
      case(?isUser){
        switch(isUser.userType == "owner"){
          case(false) return #err "Switch akun ke owner terlebih dahulu untuk melanjutkan";
          case(true) {
            return await DashboardService.getOwnerDetailDashboard(owner, arenas, bookings, userBalances);
          }
        }
      }
    };
  };

  public func getDashboardCustomer(
    customer : Principal
  ) : async Result.Result <DashboardType.CustomerDashboard, Text> {
    switch(users.get(customer)){
      case(null) return #err "Data customer tidak ditemukan";
      case(?isUser){
        switch(isUser.userType == "customer"){
          case(false) return #err "Switch akun ke customer terlebih dahulu untuk melanjutkan";
          case(true) {
            return await DashboardService.getCustomerDetailDashboard(customer, bookings, arenas, fields);
          }
        }
      }
    };
  }

};
