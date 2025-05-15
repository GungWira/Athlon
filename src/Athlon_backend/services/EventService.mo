import EventType "../types/EventType";
import Helper "../helper/Helper";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import CommunityType "../types/CommunityType";
import UserType "../types/UserType";


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
  };

  public func joinEvent(
    userPrincipal: Principal,
    eventId: Text,
    events: EventType.Events,
    users : UserType.Users,
  ) : async Bool {
    let eventOpt = events.get(eventId);
    switch (eventOpt) {
      case (null) return false;
      case (?event) {
        let userPrincipalText = Principal.toText(userPrincipal);

        let userOpt = users.get(userPrincipal);
        switch (userOpt) {
          case (null) return false;
          case (?user) {
            let exists = Array.find<EventType.EventParticipant>(
              event.participant,
              func(p: EventType.EventParticipant): Bool {
                p.principal == userPrincipalText
              }
            );

            if (exists != null) {
              return true;
            };

            let newParticipant: EventType.EventParticipant = {
              principal = userPrincipalText;
              name = user.username;
              profile = switch (user.imageProfile) {
                case (?image) image;
                case (null) "";
              };
            };

            let updatedParticipant = Array.append<EventType.EventParticipant>(event.participant, [newParticipant]);


            let updatedEvent = {
              id = event.id;
              owner = event.owner;
              ownerUsername = event.ownerUsername;
              communityId = event.communityId;
              communityName = event.communityName;
              communityProfile = event.communityProfile;
              title = event.title;
              description = event.description;
              rules = event.rules;
              banner = event.banner;
              level = event.level;
              participant = updatedParticipant;
              maxParticipant = event.maxParticipant;
              sport = event.sport;
              date = event.date;
              time = event.time;
              location = event.location;
              createdAt = event.createdAt;
            };

            events.put(eventId, updatedEvent);
            return true;
          };
        };
      };
    };
  };

  public func leaveEvent(
    userPrincipal: Principal,
    eventId: Text,
    events: EventType.Events,
    users: UserType.Users,
  ) : async Bool {
    let eventOpt = events.get(eventId);
    switch (eventOpt) {
      case (null) return false;
      case (?event) {
        let userPrincipalText = Principal.toText(userPrincipal);

        let userOpt = users.get(userPrincipal);
        switch (userOpt) {
          case (null) return false;
          case (?_user) {
            // Filter participant: buang yang principal-nya sama
            let updatedParticipant = Array.filter<EventType.EventParticipant>(
              event.participant,
              func(p: EventType.EventParticipant): Bool {
                p.principal != userPrincipalText
              }
            );

            // Jika panjang tetap sama, artinya user tidak ada di participant
            if (updatedParticipant.size() == event.participant.size()) {
              return true; // Sudah tidak ada, tidak perlu diapa-apakan
            };

            // Buat event baru dengan peserta yang sudah difilter
            let updatedEvent = {
              id = event.id;
              owner = event.owner;
              ownerUsername = event.ownerUsername;
              communityId = event.communityId;
              communityName = event.communityName;
              communityProfile = event.communityProfile;
              title = event.title;
              description = event.description;
              rules = event.rules;
              banner = event.banner;
              level = event.level;
              participant = updatedParticipant;
              maxParticipant = event.maxParticipant;
              sport = event.sport;
              date = event.date;
              time = event.time;
              location = event.location;
              createdAt = event.createdAt;
            };

            events.put(eventId, updatedEvent);
            return true;
          };
        };
      };
    };
  };



}