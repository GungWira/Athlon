import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import ArenaType "ArenaType";
import FieldType "FieldType";


module {
    public type Events = HashMap.HashMap<Text, Event>;

    public type Event = {
        id : Text;
        owner : Principal;
        ownerUsername : Text;
        communityId : Text;
        communityName : Text;
        communityProfile : Text;
        title : Text;
        description : Text;
        rules : Text;
        banner : Text;
        level : Text;
        participant : [EventParticipant];
        maxParticipant : Nat;
        sport : Text;
        date : Text;
        time : Text;
        arena : ArenaType.Arena;
        field : FieldType.Field;
        createdAt : Int;
    };

    public type EventParticipant = {
        principal : Text;
        name : Text;
        profile : Text;
    };
};