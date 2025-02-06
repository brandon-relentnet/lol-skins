import Link from 'next/link';

export default async function HomePage() {
  // Fetch champion data from your API
  const res = await fetch('http://localhost:3000/api/champions', { cache: 'no-store' });
  const champions = await res.json();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Champions</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {champions.map((champion) => {
          // Find the default skin: typically the one with skin.num === 0.
          const defaultSkin =
            champion.skins.find((skin) => skin.num === 0) || champion.skins[0];

          return (
            <li key={champion.id} className="border rounded p-2">
              {/* Make the whole item clickable */}
              <Link href={`/champions/${champion.id.toLowerCase()}`}>
                <div className="cursor-pointer hover:shadow-lg transition">
                  <img
                    src={defaultSkin.splash_url}
                    alt={`${champion.id} default skin`}
                    className="w-full h-auto rounded"
                  />
                  <h2 className="mt-2 font-bold text-xl">{champion.id}</h2>
                  <p className="text-gray-600">{champion.title}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
