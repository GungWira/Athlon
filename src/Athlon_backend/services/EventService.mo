import ArenaType "../types/ArenaType";
import FieldType "../types/FieldType";
import EventType "../types/EventType";
import Helper "../helper/Helper";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";


module {
  public func createEvent(
    owner : Principal,
    ownerUsername : Text,
    communityId : Text,
    communityName : Text,
    communityProfile : Text,
    title : Text,
    description : Text,
    rules : Text,
    banner : Text,
    level : Text,
    maxParticipant : Nat,
    sport : Text,
    date : Text,
    time : Text,
    arenaId : Text,
    fieldId : Text,
    arenas : ArenaType.Arenas,
    fields : FieldType.Fields,
    events : EventType.Events
  ) : async Text {
    let id = Helper.generateUUID(owner, description);
    switch (arenas.get(arenaId)) {
        case (null) return "No Arena Found";
        case (?eventsArena) {
            switch(fields.get(fieldId)) {
                case (null) return "No Field Found";
                case (?eventsField){
                    let event : EventType.Event = {
                    id = id;
                    owner = owner;
                    ownerUsername = ownerUsername;
                    communityId = communityId;
                    communityName = communityName;
                    communityProfile = communityProfile;
                    title = title;
                    description = description;
                    rules = rules;
                    banner = banner;
                    level = level;
                    participant = [];
                    maxParticipant = maxParticipant;
                    sport = sport;
                    date = date;
                    time = time;
                    arena = eventsArena;
                    field = eventsField;
                    createdAt = Time.now();
                    };
                    events.put(id, event);
                    return id;
                }
            }
        }
    };
  };

  public func getEventById(id : Text, events : EventType.Events) : async ?EventType.Event {
    events.get(id);
  };

  public func getEvents(events : EventType.Events) : async [EventType.Event] {
    let eventList = Iter.toArray(events.vals());

    let sortedNewest = Array.sort<EventType.Event>(
        eventList,
        func(a: EventType.Event, b: EventType.Event): {#less; #greater; #equal} {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal
        }
    );
    return sortedNewest;
  }
}