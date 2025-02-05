// app/champions/[id]/page.js (Server Component)
import ClientPage from "./ClientPage";

export default async function ChampionPage({ params }) {
    const { id } = await params;

    // We do not fetch data here server-to-server.
    // Instead, we simply render a Client Component that fetches data from the browser.

    return (
        <div className="container mx-auto p-4">
            {/* 
        Put a simple heading or placeholder.
        The real data will be fetched by ClientPage.
      */}
            <ClientPage championId={id} />
        </div>
    );
}
