import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className='flex space-x-2 p-2 bg-slate-950 text-white fixed top-0 left-0 w-full z-50'>
            <Link href="/" className=''>Home</Link>
            <Link href="/user/votes" className=''>Votes</Link>
            <Link href="/awards">Awards</Link>
        </nav>
    );
}
