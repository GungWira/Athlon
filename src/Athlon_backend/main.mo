import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Float "mo:base/Float";
import IC "ic:aaaaa-aa";
import JSON "mo:json";

// TYPES
import UserType "types/UserType";
import ArenaType "types/ArenaType";
import FieldType "types/FieldType";
import UserBalanceType "types/UserBalanceType";
import BookingType "types/BookingType";
import DashboardType "types/DashboardType";
import CommunityType "types/CommunityType";
import EventType "types/EventType";
import AiTypes "types/AiTypes";

// SERVICES
import UserService "services/UserService";
import ArenaService "services/ArenaService";
import FieldService "services/FieldService";
import TransactionService "services/TransactionService";
import BookingService "services/BookingService";
import DashboardService "services/DashboardService";
import CommunityService "services/CommunityService";
import EventService "services/EventService";
import AiService "services/AiService";


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

  private var communities : CommunityType.Communities = HashMap.HashMap<Text, CommunityType.Community>(
    0,
    Text.equal,
    Text.hash
  );

  private var events : EventType.Events = HashMap.HashMap<Text, EventType.Event>(
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
  private stable var communitiesEntries : [(Text, CommunityType.Community)] = [];
  private stable var eventEntries : [(Text, EventType.Event)] = [];

  // PREUPGRADE & POSTUPGRADE FUNC TO KEEP DATA
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    arenasEntries := Iter.toArray(arenas.entries());
    fieldsEntries := Iter.toArray(fields.entries());
    userBalancesEntries := Iter.toArray(userBalances.entries());
    bookingsEntries := Iter.toArray(bookings.entries());
    communitiesEntries := Iter.toArray(communities.entries());
    eventEntries := Iter.toArray(events.entries());
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
    communities := HashMap.fromIter<Text, CommunityType.Community>(communitiesEntries.vals(), 0, Text.equal, Text.hash);
    communitiesEntries := [];
    events := HashMap.fromIter<Text, EventType.Event>(eventEntries.vals(), 0, Text.equal, Text.hash);
    eventEntries := [];
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

  public func updateProfile(principal : Principal, username : Text, phone : Text, imageProfile : Text) : async ?UserType.User {
    return await UserService.updateProfile(principal, username, phone, imageProfile, users);
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

  public func updateArena(
    arenaId : Text,
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
  ) : async Result.Result<Text, Text> {
    return await ArenaService.updateArena(arenaId, name, description, images, sports, province, city, district, mapsLink, rules, facilities, arenas);
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION FIELD ------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------

  public func createField(
    arenaId: Text,
    name: Text,
    description: Text,
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
      description,
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

  public func getBookingById(id : Text) : async ?BookingType.Booking {
    return bookings.get(id);
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
            return await DashboardService.getOwnerDetailDashboard(owner, arenas, bookings, userBalances, communities);
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
            return await DashboardService.getCustomerDetailDashboard(customer, bookings, arenas, fields, communities, events);
          }
        }
      }
    };
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION LLM --------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------
  public func testBot(input : Text, passAnswer : Text) : async Result.Result<Text, Text> {
    return await AiService.askBot(input, passAnswer);
  };

  public func generateDesc(content: AiTypes.GenDescAi) : async Result.Result<Text, Text> {
    return await AiService.generateDesc(content);
  };

  public func generateRules(content: AiTypes.GenDescAi) : async Result.Result<Text, Text> {
    return await AiService.generateRules(content);
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION COMMUNITY --------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------
  public func createCommunity(
    name : Text,
    owner : Principal,
    ownerName: Text,
    sports: [Text],
    description: Text,
    profile: Text,
    banner : Text,
    rules: Text
  ): async Text {
    await CommunityService.createCommunity(name, owner, ownerName, sports, description, profile, banner, rules, communities);
  };

  public func getCommunityById(id: Text): async Result.Result<(CommunityType.Community, [EventType.Event]), Text> {
    await CommunityService.getCommunityById(id, communities, events);
  };

  public func getCommunities() : async [CommunityType.Community] {
    return await CommunityService.getCommunities(communities);
  };

  public func joinCommunity(id: Text, user : Principal) : async Bool {
    return await CommunityService.joinCommunity(id, user, communities);
  };

  public func leaveCommunity(id: Text, user : Principal) : async Bool {
    return await CommunityService.leaveCommunity(id, user, communities);
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION EVENT ------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------

  public func createEvent(
    owner : Principal,
    ownerUsername : Text,
    communityId : Text,
    title : Text,
    description : Text,
    sport : [Text],
    rules : Text,
    banner : Text,
    level : Text,
    maxParticipant : Nat,
    date : Text,
    time : Text,
    location : Text,
  ) : async Text {
    return await EventService.createEvent(owner, ownerUsername, communityId, title, description, rules, banner, level, maxParticipant, sport, date, time, location, communities, events);
  };

  public func getEventById(id : Text) : async ?EventType.Event {
    return await EventService.getEventById(id, events);
  };

  public func getEvents() : async [EventType.Event] {
    return await EventService.getEvents(events);
  };

  public func joinEvent(id: Text, user : Principal) : async Bool {
    return await EventService.joinEvent(user, id, events, users);
  };

  public func leaveEvent(id: Text, user : Principal) : async Bool {
    return await EventService.leaveEvent(user, id, events, users);
  };

  // ---------------------------------------------------------------------------------------------------------------
  // FUNCTION ICP RATE ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------

  public query func transform({
    // context : Blob;
    response : IC.http_request_result;
  }) : async IC.http_request_result {
    {
      response with headers = [];
    };
  };

  public func get_icp_idr_exchange() : async Text {
      let host : Text = "api.coingecko.com";
      let url = "https://" # host # "/api/v3/simple/price?ids=internet-computer&vs_currencies=idr";

      let request_headers = [
          { name = "User-Agent"; value = "price-feed" },
          { name = "Accept"; value = "application/json" },
      ];

      let http_request : IC.http_request_args = {
          url = url;
          max_response_bytes = ?2048;
          headers = request_headers;
          body = null;
          method = #get;
          transform = ?{
              function = transform;
              context = Blob.fromArray([]);
          };
      };

      // Tambahkan cycles untuk pemanggilan HTTPS
      Cycles.add<system>(230_949_972_000);

      let http_response = await IC.http_request(http_request);

      let raw = switch (Text.decodeUtf8(http_response.body)) {
          case (?r) r;
          case null return "0"; // Error decode
      };

      // Parse JSON
      let parsed = JSON.parse(raw);
      switch (parsed) {
        case (#ok(data)) {
          switch(JSON.get(data, "internet-computer")) {
            case (?idr) {
              switch(JSON.get(idr, "idr")) {
                case (?val) {
                  switch (val) {
                    case (#number(num)) {
                      switch (num) {
                        case (#int(i)) {
                          return Int.toText(i);
                        };
                        case (#float(f)) {
                          return Float.toText(f);
                        };
                      };
                    };
                    case (_) {
                      Debug.print("Value bukan number");
                      return "0";
                    };
                  };
                };
                case (_) {
                  Debug.print("Key 'idr' tidak ditemukan");
                  return "0";
                };
              };
            };
            case (_) {
              Debug.print("Key 'internet-computer' tidak ditemukan");
              return "0";
            };
          };
        };
        case (#err(e)) {
          Debug.print("Gagal parse JSON: " # debug_show(e));
          return "0";
        };
      };
  };

};
