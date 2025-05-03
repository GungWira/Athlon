import Loading from "../components/Loading";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, login, logout, userData, loading } = useAuth();

  if (loading) return <Loading />;
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome! Your principal: {userData.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login with Internet Identity</button>
      )}
    </div>
  );
}
