import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
module {
  public type GenDescAiRequest = HashMap.HashMap<Text, Text>;

  type StyleGuide = {
    tone : Text;
    structure : [Text];
  };  

  public type GenDescAi = {
    instructions : Text;
    arenaName : Text;
    locations : Text;
    formatOutput : Text;
    sportsType : Text;
    context : Text;
    facilitate : Text;
  };

  public type Body = {
    role : Text;
    description : Text;
    task : Text;
    output_format : Text;
    style_guide : StyleGuide;
    input : GenDescAi;
    note: Text;
  };
};
