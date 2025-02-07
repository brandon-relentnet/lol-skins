import Link from 'next/link';

export default async function ChampionPage() {
  // Fetch champion data from your API
  const res = await fetch('http://localhost:3000/api/champions', { cache: 'no-store' });
  const champions = await res.json();

  return (
    <>
      <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">Champions</h1>
      <h2 className="text-xl mb-6 text-grey1">Click on a champion card to view and vote on their skins.</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {champions.map((champion) => {
          // Find the default skin: typically the one with skin.num === 0.
          const defaultSkin =
            champion.skins.find((skin) => skin.num === 0) || champion.skins[0];

          return (
            <li key={champion.id} className='bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150'>
              {/* Make the whole item clickable */}
              <Link href={`/champions/${champion.id.toLowerCase()}`}>
                <div className="cursor-pointer">
                  <img
                    src={defaultSkin.splash_url}
                    alt={`${champion.id} default skin`}
                    className="w-full h-auto"
                  />
                  <div className='flex flex-col items-center justify-center p-4'>
                    <h2 className="text-xl text-grey1">{champion.id}</h2>
                    <p className="text-grey2">{champion.title}</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
