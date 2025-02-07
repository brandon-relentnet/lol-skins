// app/champions/[id]/page.js (Server Component)
import ClientPage from "./ClientPage";

export default async function ChampionPage({ params }) {
    const { id } = await params;

    return (
        <>
            <ClientPage championId={id} />
        </>
    );
}
