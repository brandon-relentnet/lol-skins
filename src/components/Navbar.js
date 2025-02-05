import Link from 'next/link';

export default function NavBar() {
    return (
        <nav>
            <Link href="/" className='mr-2'>Home</Link>
            <Link href="/user/votes">Votes</Link>
        </nav>
    );
}
