import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

module {
    public type Arenas = HashMap.HashMap<Text, Arena>;

    public type Arena = {
        id: Text;
        name: Text;
        description: Text;
        images: [Text];
        sports: [Text];
        province: Text;
        city: Text;
        district: Text;
        mapsLink: Text;
        rules: Text;
        facilities: [Text];
        status: Text; // active | deactive 
        createdAt: Int;
        owner: Principal;
    };

    public type ArenaRecommendation = {
        preferred : [Arena];
        newest : [Arena];
        oldest : [Arena];
    };

}
