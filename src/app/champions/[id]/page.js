import { notFound } from 'next/navigation';

export default async function ChampionPage({ params }) {
    // params.id comes from the URL, e.g. "aatrox"
    const { id } = await params;

    // Fetch champion details using the id.
    // (Your API endpoint should do a case-insensitive lookup.)
    const res = await fetch(`http://localhost:3000/api/champions/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        return notFound();
    }
    const champion = await res.json();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold">
                {champion.id} - {champion.title}
            </h1>
            <p className="mt-2 text-gray-700">{champion.lore}</p>

            <h2 className="mt-6 text-2xl font-bold">Skins</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {champion.skins.map((skin) => (
                    <div key={skin.id} className="border rounded p-2">
                        <img
                            src={skin.splash_url}
                            alt={`${champion.id} ${skin.name}`}
                            className="w-full h-auto rounded"
                        />
                        <p className="mt-2 text-center">{skin.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
