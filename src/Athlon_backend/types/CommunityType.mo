import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";

module {
  public type Communities = HashMap.HashMap<Text, Community>;

  public type Community = {
    id : Text;
    owner : Principal;
    ownerName : Text;
    name : Text;
    sports : [Text];
    description : Text;
    profile : Text;
    banner : Text;
    rules : Text;
    members : [Text];
    createdAt : Int;
  };
}