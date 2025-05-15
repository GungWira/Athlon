import ArenaType "../types/ArenaType";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Helper "../helper/Helper";
import FieldType "../types/FieldType";
import BookingType "../types/BookingType";
import FieldService "FieldService";
import UserType "../types/UserType";

module {
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
    owner: Principal,
    arenas: ArenaType.Arenas
  ): async ArenaType.Arena {
    let createdAt = Time.now();

    let id = Helper.generateUUID(owner, description);

    let newArena: ArenaType.Arena = {
      id = id;
      name = name;
      description = description;
      images = images;
      sports = sports;
      province = province;
      city = city;
      district = district;
      mapsLink = mapsLink;
      rules = rules;
      facilities = facilities;
      status = "deactive";
      createdAt = createdAt;
      owner = owner;
    };

    arenas.put(id, newArena);
    return newArena;
  };

    public func searchArenas(
        arenas: ArenaType.Arenas,
        nameFilter: ?Text,
        locationFilter: ?Text,
        sportFilter: ?Text
    ): async [ArenaType.Arena] {
        let allArenas = Iter.toArray(arenas.vals());

        let filtered = Array.filter<ArenaType.Arena>(
            allArenas,
            func(a: ArenaType.Arena): Bool {
                let matchName = switch (nameFilter) {
                    case (null) true;
                    case (?key) Text.contains(a.name, #text key);
                };

                let matchLocation = switch (locationFilter) {
                    case (null) true;
                    case (?loc) a.city == loc;
                };

                let matchSport = switch (sportFilter) {
                    case (null) true;
                    case (?sport) Helper.any<Text>(a.sports, func(t: Text): Bool { t == sport });
                };

                let isActive = switch (a.status == "active"){
                    case (false) false;
                    case (true) true;
                };

                matchName and matchLocation and matchSport and isActive;
            }
        );

        return filtered;
    };

    public func getArenaBookingDetail(
        arenaId : Text,
        arenas : ArenaType.Arenas,
        fields : FieldType.Fields,
        bookings : BookingType.Bookings,
        date : Text
    ) : async ?{
        arena : ArenaType.Arena;
        arenaFields : [FieldType.Field];
        bookingDatas : [(Text, [BookingType.Booking])];
    } {
    // AMBIL ARENA BY ID ARENA
    let maybeArena = arenas.get(arenaId);
        switch (maybeArena) {
            case null { return null };
            case (?arena) {
                let allFields = Iter.toArray(fields.vals());
                let arenaFields = Array.filter(allFields, func(f : FieldType.Field) : Bool {
                    f.arenaId == arenaId
                });

                let allBookings = Iter.toArray(bookings.vals());
                let bookingsByField = Array.map<FieldType.Field, (Text, [BookingType.Booking])>(arenaFields, func(field : FieldType.Field) : (Text, [BookingType.Booking]) {
                    let fieldBookings = Array.filter(allBookings, func(b : BookingType.Booking) : Bool {
                    b.fieldId == field.id and b.date == date
                    });
                    (field.id, fieldBookings)
                });

                return ?{
                    arena = arena;
                    arenaFields = arenaFields;
                    bookingDatas = bookingsByField;
                };
            };
        };
    };

    public func setArenaStatus (arenaId : Text, status : Text, arenas : ArenaType.Arenas, fields : FieldType.Fields) : async Result.Result<Text, Text> {
        let target = arenas.get(arenaId);
        switch(target){
            case(null) return #err "Arena tidak ditemukan";
            case(?isArena) {
                let fieldByArenaId = await FieldService.getFieldsByArenaId(arenaId, fields);
                switch(fieldByArenaId){
                    case(#err _) {
                        switch(status){
                            case("active") {
                                let newArena : ArenaType.Arena = {
                                    id = isArena.id;
                                    name = isArena.name;
                                    description = isArena.description;
                                    images = isArena.images;
                                    sports = isArena.sports;
                                    province = isArena.province;
                                    city = isArena.city;
                                    district = isArena.district;
                                    mapsLink = isArena.mapsLink;
                                    rules = isArena.rules;
                                    facilities = isArena.facilities;
                                    status = switch(isArena.status) {
                                        case("active") "deactive";
                                        case(_) "active";
                                    }; 
                                    createdAt = isArena.createdAt;
                                    owner = isArena.owner;
                                };
                                arenas.put(arenaId, newArena);
                                return #ok "Berhasil mengubah status arena";
                            };
                            case(_) return #err "Arena tanpa lapangan tidak dapat diaktifkan"
                        }
                    };
                    case(#ok _) {
                        let newArena : ArenaType.Arena = {
                            id = isArena.id;
                            name = isArena.name;
                            description = isArena.description;
                            images = isArena.images;
                            sports = isArena.sports;
                            province = isArena.province;
                            city = isArena.city;
                            district = isArena.district;
                            mapsLink = isArena.mapsLink;
                            rules = isArena.rules;
                            facilities = isArena.facilities;
                            status = switch(isArena.status) {
                                case("active") "deactive";
                                case(_) "active";
                            }; 
                            createdAt = isArena.createdAt;
                            owner = isArena.owner;
                        };
                        arenas.put(arenaId, newArena);
                        return #ok "Berhasil mengubah status arena";

                    }
                };
            };
        };
    };

    public func getArenaRecommendation(
        userOpt : ?Principal,
        users : UserType.Users,
        arenas : ArenaType.Arenas
    ) : async ArenaType.ArenaRecommendation {

        let arenaList = Iter.toArray(arenas.vals());

        // Ambil arena berdasarkan createdAt terbaru
        let sortedNewest = Array.sort<ArenaType.Arena>(
            arenaList,
            func(a: ArenaType.Arena, b: ArenaType.Arena): {#less; #greater; #equal} {
            if (a.createdAt > b.createdAt) #less
            else if (a.createdAt < b.createdAt) #greater
            else #equal
            }
        );

        // Ambil arena berdasarkan createdAt terlama
        let sortedOldest = Array.sort<ArenaType.Arena>(
            arenaList,
            func(a: ArenaType.Arena, b: ArenaType.Arena): {#less; #greater; #equal} {
            if (a.createdAt < b.createdAt) #less
            else if (a.createdAt > b.createdAt) #greater
            else #equal
            }
        );

        // Fungsi helper untuk filter berdasarkan sports
        func hasMatchingSport(arena: ArenaType.Arena, preferred: [Text]) : Bool {
            Helper.any<Text>(arena.sports, func(sport: Text): Bool {
                Helper.contains<Text>(preferred, sport, Text.equal)
            })
        };


        let preferredArenas : [ArenaType.Arena] = switch (userOpt) {
            case (?user) {
            switch (users.get(user)) {
                case (?u) {
                let matched = Array.filter<ArenaType.Arena>(
                    sortedNewest,
                    func(a: ArenaType.Arena): Bool {
                    hasMatchingSport(a, Option.get(u.preferedSports, []))
                    }
                );
                Array.take(matched, 8)
                };
                case (_) [];
            }
            };
            case (_) [];
        };

        {
            preferred = preferredArenas;
            newest = Array.take(sortedNewest, 8);
            oldest = Array.take(sortedOldest, 8);
        }
    };

}