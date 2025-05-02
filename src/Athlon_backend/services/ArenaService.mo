// arenaService.mo
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import { Arena } from "arenatypes.mo";

actor ArenaService {
    // HashMap untuk menyimpan arena dengan key berupa ID arena
    private var arenas: HashMap.HashMap<Nat, Arena> = HashMap.init<Nat, Arena>();
    private var arenaIdCounter: Nat = 0;

    // Create a new arena
    public func createArena(name: Text, location: Text, sportTypes: [Text], description: Text, image: Text, owner: Principal) : async Arena {
        let id = arenaIdCounter;
        arenaIdCounter := arenaIdCounter + 1;
        let createdAt = Time.now();
        
        let newArena = Arena {
            id = id;
            name = name;
            location = location;
            sportTypes = sportTypes;
            description = description;
            image = image;
            createdAt = createdAt;
            owner = owner;
        };

        arenas := HashMap.put(arenas, id, newArena);
        return newArena;
    }

    // Get all arenas
    public func getAllArena() : async [Arena] {
        return HashMap.values(arenas);
    }

    // Get arena by specific criteria (name, id, location, sport type)
    public func getSpesifik(name: ?Text, id: ?Nat, location: ?Text, sportTypes: ?[Text]) : async [Arena] {
        let filteredArenas = Array.filter(HashMap.values(arenas), func(a: Arena) : Bool {
            switch (name, id, location, sportTypes) {
                case (?name, _, _, _) if (a.name == name) { return true };
                case (_, ?id, _, _) if (a.id == id) { return true };
                case (_, _, ?location, _) if (a.location == location) { return true };
                case (_, _, _, ?sportTypes) if (Array.equal(a.sportTypes, sportTypes)) { return true };
                case _ { return false };
            }
        });
        return filteredArenas;
    }
};
