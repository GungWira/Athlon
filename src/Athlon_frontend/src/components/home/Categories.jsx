import { SportCategory } from "./SportCategory";
import { sportCategories } from "../../data/dummy-data";

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto py-12">
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
  );
}
