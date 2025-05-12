import { CardArena } from "./CardArena";

export default function TrustedSportcenter({ datas }) {
  return (
    <section className="max-w-7xl mx-auto py-12">
      <div className="flex flex-col justify-start items-start gap-2 mb-8">
        <h2 className="text-2xl font-bold text-[#202020]">
          Trusted Sportcenter
        </h2>
        <p className="text-base text-[#202020]/80">
          Arena olahraga dengan sejuta kenangan menarik dari para penggunanya!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {datas.map((arena) => (
          <CardArena
            key={arena.id}
            id={arena.id}
            image={arena.images[0]}
            name={arena.name}
            location={arena.province}
            price={0}
            description={arena.description}
            tag={arena.sports}
          />
        ))}
      </div>
    </section>
  );
}
