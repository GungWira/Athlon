import Hero from "../components/home/Hero";
import { SportCategory } from "../components/home/SportCategory";
import { sportCategories, trendingArenas } from "../data/dummy-data";
import { CardArena } from "../components/home/CardArena";

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Sport Categories</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {sportCategories.map((category, index) => (
            <SportCategory
              key={index}
              icon={category.icon}
              name={category.name}
            />
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Trending Sportcenter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingArenas.map((arena) => (
            <CardArena
              key={arena.id}
              image={arena.image}
              name={arena.name}
              location={arena.location}
              price={arena.price}
              description={arena.description}
              tag={arena.tag}
              tagColor={arena.tagColor}
              timeSlots={arena.timeSlots}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
