import FieldType "../types/FieldType";

import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Helper "../helper/Helper";


module {
  public func createField(
    arenaId: Text,
    name: Text,
    description: Text,
    sportType: Text,
    size: Text,
    price: Nat,
    priceUnit: Text,
    availableTimes: [Text],
    image : Text,
    owner: Principal,
    fields: FieldType.Fields
  ): async FieldType.Field {
    let createdAt = Time.now();

    let id = Helper.generateUUID(owner, name);

    let field: FieldType.Field = {
      id = id;
      arenaId = arenaId;
      name = name;
      description = description;
      sportType = sportType;
      size = size;
      price = price;
      priceUnit = priceUnit;
      image = image;
      owner = owner;
      createdAt = createdAt;
      availableTimes = availableTimes;
    };
    fields.put(id, field);
    return field;
  };

  public func getFieldsByArenaId(arenaId: Text, fields : FieldType.Fields): async Result.Result<FieldType.Field, Text> {
    let values = fields.vals();
    for (field in values) {
      if (field.arenaId == arenaId) {
        return #ok field;
      };
    };
    return #err "Tidak ada field yang ditemukan";
  };
}
