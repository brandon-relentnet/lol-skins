// app/champions/[id]/page.js (Server Component)
import ClientPage from "./ClientPage";

export default async function ChampionPage({ params }) {
    const { id } = await params;

    return (
        <div className="container mx-auto p-4 mt-15 mb-45">
            <ClientPage championId={id} />
        </div>
    );
}
