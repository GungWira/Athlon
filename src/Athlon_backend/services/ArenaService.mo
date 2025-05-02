

import ArenaType "../types/ArenaType";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

module {
    public func createArena(
        id: Nat,
        name: Text,
        location: Text,
        sportTypes: [Text],
        description: Text,
        image: Text,
        owner: Principal,
        arenas: ArenaType.Arenas
    ): async ArenaType.Arena{
        let createdAt = Time.now();
        let newArena : ArenaType.Arena = {
            id = id;
            name = name;
            location = location;
            sportTypes = sportTypes;
            description = description;
            image = image;
            createdAt = createdAt;
            owner = owner;
        };

        arenas.put(owner, newArena);
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
                    case (?loc) a.location == loc;
                };

                let matchSport = switch (sportFilter) {
                    case (null) true;
                    case (?sport) arrayAny<Text>(a.sportTypes, func(t: Text): Bool { t == sport });
                };

                matchName and matchLocation and matchSport;
            }
        );

        return filtered;
    };

    func arrayAny<T>(arr: [T], predicate: (T) -> Bool): Bool {
        for (val in arr.vals()) {
            if (predicate(val)) {
                return true;
            }
        };
        return false;
    }
}