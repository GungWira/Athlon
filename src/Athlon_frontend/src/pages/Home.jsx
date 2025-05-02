import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, login, logout, principal } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome! Your principal: {principal}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Button className="" onClick={login}>Login with Internet Identity test wwwww</Button>
      )}
    </div>
  );
}
