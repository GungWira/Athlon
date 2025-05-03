import { Link } from "react-router-dom";

export default function DashboardOwner() {
  return (
    <div>
      <h1>DashboardOwner</h1>
      <Link to={{ pathname: "/owner/create-arena" }}>
        <button>Buat Arena</button>
      </Link>
    </div>
  );
}
