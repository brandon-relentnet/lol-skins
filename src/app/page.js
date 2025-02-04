
export default async function Home() {
  const res = await fetch('http://localhost:3000/api/champions', { cache: 'no-store' });
  const champions = await res.json();

  return (
    <div>
      <h1>Champions</h1>
      <ul>
        {champions.map((champion) => (
          <li
            key={champion.id}
            className="mb-2"
          >
            <h1 className="font-bold">{champion.id}</h1>
            <h2>{champion.title}</h2>
            <p>{champion.blurb}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
