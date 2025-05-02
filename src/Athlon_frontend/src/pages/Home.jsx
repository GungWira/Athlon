import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, login, logout, principal } = useAuth();
  const navigate = useNavigate()

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome! Your principal: {principal}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Button className="" onClick={() => navigate('/login')}>Sign in</Button>
      )}
    </div>
  );
}
