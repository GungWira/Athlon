import { SportCategory } from "./SportCategory";
import { sportCategories } from "../../data/dummy-data";

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto py-12">
      <div className="flex flex-col justify-start items-start gap-2 mb-8">
        <h2 className="text-2xl font-bold text-[#202020]">Sport Categories</h2>
        <p className="text-base text-[#202020]/80">
          Olahraga yang lagi trending nih!
        </p>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
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
