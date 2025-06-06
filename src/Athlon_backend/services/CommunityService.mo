import Helper "../helper/Helper";
import CommunityType "../types/CommunityType";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import EventType "../types/EventType";

module {
// CREATE
  public func createCommunity(
    name: Text,
    owner: Principal,
    ownerName: Text,
    sports: [Text],
    description: Text,
    profile: Text,
    banner : Text,
    rules: Text,
    communities : CommunityType.Communities,
  ): async Text {
    let id = Helper.generateUUID(owner, description);
    let community: CommunityType.Community = {
      id;
      owner;
      ownerName;
      name;
      sports;
      description;
      profile;
      banner;
      rules;
      members = [Principal.toText(owner)];
      createdAt = Time.now();
    };
    communities.put(id, community);
    return id;
  };

  public func getCommunityById(
    id: Text,
    communities: CommunityType.Communities,
    events: EventType.Events
  ): async Result.Result<(CommunityType.Community, [EventType.Event]), Text> {
    switch (communities.get(id)) {
      case (?isCom) {
        let eventList = Iter.toArray(events.vals());
        let relatedEvents = Array.filter<EventType.Event>(eventList, func(e) = e.communityId == id);
        return #ok (isCom, relatedEvents);
      };
      case (null) return #err "No community found";
    }
  };

  public func getCommunities(communities : CommunityType.Communities) : async [CommunityType.Community] {
    let comunitiesList = Iter.toArray(communities.vals());

    let sortedNewest = Array.sort<CommunityType.Community>(
        comunitiesList,
        func(a: CommunityType.Community, b: CommunityType.Community): {#less; #greater; #equal} {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal
        }
    );
    return sortedNewest;
  };

  // FIND by name or sport or both
//   public func searchCommunity(nameQuery: ?Text, sportQuery: ?Text): async [CommunityType.Community] {
//     Array.filter(communities, func(c) {
//       let nameMatch = switch (nameQuery) {
//         case (?res) Text.contains(c.ownerName # c.description, res);
//         case (_) true;
//       };
//       let sportMatch = switch (sportQuery) {
//         case (?sport) Array.some(c.sports, func(s) { s == sport });
//         case (_) true;
//       };
//       nameMatch and sportMatch;
//     });
//   };

  // JOIN
    public func joinCommunity(id: Text, user: Principal, communities: CommunityType.Communities): async Bool {
        switch (communities.get(id)) {
            case (null) return false;
            case (?isCom) {
            if (Array.find<Text>(isCom.members, func (m) = m == Principal.toText(user)) != null) {
                return true; 
            };

            let updatedMembers = Array.append<Text>(isCom.members, [Principal.toText(user)]);

            let updatedCommunity = {
                id = isCom.id;
                owner = isCom.owner;
                ownerName = isCom.ownerName;
                name = isCom.name;
                sports = isCom.sports;
                description = isCom.description;
                profile = isCom.profile;
                banner = isCom.banner;
                rules = isCom.rules;
                members = updatedMembers;
                createdAt = isCom.createdAt;
            };

            communities.put(id, updatedCommunity);

            return true;
            }
        };
    };

public func leaveCommunity(id: Text, user: Principal, communities: CommunityType.Communities): async Bool {
  switch (communities.get(id)) {
    case (null) return false;
    case (?isCom) {
      let updatedMembers = Array.filter<Text>(isCom.members, func (m) = m != Principal.toText(user));

      if (updatedMembers.size() == isCom.members.size()) {
        return false;
      };

        let updatedCommunity = {
            id = isCom.id;
            owner = isCom.owner;
            ownerName = isCom.ownerName;
            name = isCom.name;
            sports = isCom.sports;
            description = isCom.description;
            profile = isCom.profile;
            banner = isCom.banner;
            rules = isCom.rules;
            members = updatedMembers;
            createdAt = isCom.createdAt;
       };

      communities.put(id, updatedCommunity);

      return true;
    }
  };
};

}