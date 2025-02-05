import Link from 'next/link';

export default function NavBar() {
    return (
        <nav>
            <Link href="/" className='mr-2'>Home</Link>
            <Link href="/user/votes" className='mr-2'>Votes</Link>
            <Link href="/awards">Awards</Link>
        </nav>
    );
}
