import EventType "../types/EventType";
import Helper "../helper/Helper";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import CommunityType "../types/CommunityType";


module {
  public func createEvent(
    owner : Principal,
    ownerUsername : Text,
    communityId : Text,
    title : Text,
    description : Text,
    rules : Text,
    banner : Text,
    level : Text,
    maxParticipant : Nat,
    sport : [Text],
    date : Text,
    time : Text,
    location : Text,
    communities : CommunityType.Communities,
    events : EventType.Events
  ) : async Text {
    let id = Helper.generateUUID(owner, description);
    switch (communities.get(communityId)) {
        case (null) return "No Community Found";
        case (?isCommunity) {
            let event : EventType.Event = {
            id = id;
            owner = owner;
            ownerUsername = ownerUsername;
            communityId = communityId;
            communityName = isCommunity.name;
            communityProfile = isCommunity.profile;
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
            location = location;
            createdAt = Time.now();
            };
            events.put(id, event);
            return id;
        }
    };
  };

  public func getEventById(id : Text, events : EventType.Events) : async ?EventType.Event {
    let eventList = Iter.toArray(events.vals());
    return Array.find<EventType.Event>(eventList, func(event : EventType.Event) : Bool {
      event.id == id
    });
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