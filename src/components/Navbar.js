import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faAward } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {
    return (
        <nav className='px-10 flex h-26 justify-between items-center border-b border-icon bg-transparent backdrop-blur-2xl fixed top-0 left-0 w-full z-50'>
            <div>
                Logo
            </div>
            <div className='flex space-x-6 h-26 justify-center items-center'>
                <Link href="/">
                    <FontAwesomeIcon icon={faHouse} className='h-7 text-icon' />
                </Link>
                <div className='h-[70%] w-[2px] bg-gradient-to-b from-transparent via-icon to-transparent'></div>
                <Link href="/user/votes">
                    <FontAwesomeIcon icon={faUser} className='h-7 text-icon' />
                </Link>
                <div className='h-[70%] w-[2px] bg-gradient-to-b from-transparent via-icon to-transparent'></div>
                <Link href="/awards">
                    <FontAwesomeIcon icon={faAward} className='h-7 text-icon' />
                </Link>
            </div>
            <div>
                Socials/Donate
            </div>
        </nav>
    );
}
