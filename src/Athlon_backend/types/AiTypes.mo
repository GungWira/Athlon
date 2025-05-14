import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
module {
  public type GenDescAiRequest = HashMap.HashMap<Text, Text>;

  type StyleGuide = {
    tone : Text;
    structure : [Text];
  };  

  public type GenDescAi = {
    arenaName : Text;
    locations : Text;
    sportsType : Text;
    context : Text;
  };
};
