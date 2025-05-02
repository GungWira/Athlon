module {
  public type Field = {
      id: Nat;
      arenaId: Nat;
      name: Text;
      sportType: Text;
      image: Text;
      pricePerHour: Nat;
      owner: Principal;
  };
}
