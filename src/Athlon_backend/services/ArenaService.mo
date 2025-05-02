

import ArenaType "../types/ArenaType";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

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
}