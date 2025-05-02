import FieldType "../types/FieldType";

module {
  public func createField(
    id: Nat,
    arenaId: Nat,
    name: Text,
    sportType: Text,
    image: Text,
    pricePerHour: Nat
  ) : FieldType.Field {
    {
      id;
      arenaId;
      name;
      sportType;
      image;
      pricePerHour;
    }
  }
}
