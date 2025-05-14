import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import {
  LandPlot,
  LayoutDashboard,
  NotebookTabs,
  User,
  Users,
} from "lucide-react";
import OverviewCustomer from "../../components/dashboard/OverviewCustomer";
import BookingCustomer from "../../components/dashboard/BookingCustomer";
import CommunityCustomer from "../../components/dashboard/CommunityCustomer";
import AkunSaya from "../../components/dashboard/AkunSaya";

export default function DashboardCustomer() {
  const [navigation, setNavigation] = useState("overview");
  const { actor, principal, userData } = useAuth();
  const [datas, setDatas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArena = async () => {
      try {
        if (actor) {
          const result = await actor.getDashboardCustomer(principal);
          if (result) {
            setDatas(result.ok);
            console.log(result.ok);
          } else {
            setDatas([]);
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [actor]);

  if (loading && !datas) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row justify-start items-start gap-6 mt-4">
      {/* NAVIGATION */}
      <div className="flex flex-col px-4 py-6 rounded-xl border border-[#202020]/20 w-full max-w-xs">
        <h1 className="text-md font-semibold text-[#202020]">
          Dashboard Owner
        </h1>
        <div className="flex flex-col justify-start items-start gap-4 mt-4 px-1">
          <div
            onClick={() => setNavigation("overview")}
            className="flex flex-row justify-start items-center gap-3 cursor-pointer group"
          >
            <LayoutDashboard
              className={`${navigation == "overview"
                  ? "text-indigo-600"
                  : "text-[#202020]/75"
                } group-hover:text-indigo-600`}
            />
            <p
              className={`text-base ${navigation == "overview"
                  ? "text-indigo-600"
                  : "text-[#202020]/75"
                } group-hover:text-indigo-600`}
            >
              Overview
            </p>
          </div>
          <div
            onClick={() => setNavigation("booking")}
            className="flex flex-row justify-start items-center gap-3 cursor-pointer group"
          >
            <LandPlot
              className={`${navigation == "booking"
                  ? "text-indigo-600"
                  : "text-[#202020]/75"
                } group-hover:text-indigo-600`}
            />
            <p
              className={`text-base ${navigation == "booking"
                  ? "text-indigo-600"
                  : "text-[#202020]/75"
                } group-hover:text-indigo-600`}
            >
              Booking
            </p>
          </div>
          <div
            onClick={() => setNavigation("community")}
            className="flex flex-row justify-start items-center gap-3 cursor-pointer group"
          >
            <Users
              className={`${navigation == "community"
                  ? "text-indigo-600"
                  : "text-[#202020]/75"
                } group-hover:text-indigo-600`}
            />
            <p
              className={`text-base ${navigation == "community"
                  ? "text-indigo-600"
                  : "text-[#202020]/75"
                } group-hover:text-indigo-600`}
            >
              Komunitas
            </p>
          </div>
          <div
            onClick={() => setNavigation("account")}
            className="flex flex-row justify-start items-center gap-3 cursor-pointer group"
          >
            <User
              className={`${navigation == "account"
                  ? "text-indigo-600"
                  : "text-[#202020]/75"
                } group-hover:text-indigo-600`}
            />
            <p
              className={`text-base ${navigation == "account"
                  ? "text-indigo-600"
                  : "text-[#202020]/75"
                } group-hover:text-indigo-600`}
            >
              Akun Saya
            </p>
          </div>
        </div>
      </div>
      {/* AREA DATA */}
      {navigation == "overview" && (
        <OverviewCustomer datas={datas} userData={userData} />
      )}

      {navigation == "booking" && (
        <BookingCustomer datas={datas} userData={userData} />
      )}

      {navigation == "community" && (
        <CommunityCustomer datas={datas} userData={userData} />
      )}

      {navigation == "account" && (
        <AkunSaya datas={datas} userData={userData} />
      )}
    </div>
  );
}
