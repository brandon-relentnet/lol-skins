// app/champions/[id]/page.jsx
import { notFound } from 'next/navigation';
import SkinCard from '@/components/SkinCard';

export default async function ChampionPage({ params }) {
    const { id } = await params;
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
                    <SkinCard
                        key={skin.id}
                        skin={skin}
                        championId={champion.id}
                        userId="testUser"
                        initialVote={skin.user_vote ?? 0}
                        initialStar={skin.user_star ?? false}
                        initialX={skin.user_x ?? false}
                    />
                ))}
            </div>
        </div>
    );
}
