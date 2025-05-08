import Hero from "../components/home/Hero";
import { SportCategory } from "../components/home/SportCategory";
import { sportCategories, trendingArenas } from "../data/dummy-data";
import { CardArena } from "../components/home/CardArena";
import Categories from "../components/home/Categories";
import TrendingSportCenter from "../components/home/TrendingSportCenter";
import ArenaRecomendation from "../components/home/ArenaRecomendation";

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <ArenaRecomendation />
    </div>
  );
}
