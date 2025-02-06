import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faAward } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {
    return (
        <nav className='px-10 flex h-26 justify-between items-center border-b border-b-icon/30 border-t-2 border-t-gold5 bg-transparent backdrop-blur-2xl fixed top-0 left-0 w-full z-50'>
            <div className='flex items-center justify-center border border-icon/30 rounded-l-full'>
                <div className='h-[56px] w-[56px] bg-gold4 rounded-full flex justify-center items-center'>
                    <div className='h-[50px] w-[50px] border-2 border-black bg-radial from-blue3 from-40% to-blue4 rounded-full flex justify-center items-center'>
                        <Link href="/">
                            <FontAwesomeIcon icon={faHouse} className='h-7 text-gold4' />
                        </Link>
                    </div>
                </div>
                <Link href="/" className="relative group">
                    <svg width="200" height="50" viewBox="0 0 185 50" className="-ml-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="185" height="50" className="opacity-0" />

                        <rect x="150" y="0" width="39" height="50" className="fill-blue5" />
                        <rect x="150" y="3" width="36" height="44" className="fill-hextech-black" />

                        <path d="M10 0 H158 L190 25 L158 50 H10 Q30 25 10 0"
                            className="fill-blue3 transition duration-150 group-hover:fill-blue2" />

                        <path d="M15 3 H156 L185 25 L156 47 H15 Q32 25 15 3"
                            className="fill-grey3 pointer-events-none" />

                        <text x="95" y="32" fontSize="20" fontWeight="bold" className="fill-gold1 pointer-events-none"
                            textAnchor="middle" fontFamily="serif">HOME</text>
                    </svg>
                </Link>


            </div>
            <div className='flex space-x-6 h-26 justify-center items-center absolute left-1/2 transform -translate-x-1/2'>
                <Link href="/">
                    <FontAwesomeIcon icon={faHouse} className='h-7 text-icon' />
                </Link>
                <div className='h-[70%] w-[2px] bg-gradient-to-b from-transparent via-icon to-transparent' />
                <Link href="/user/votes">
                    <FontAwesomeIcon icon={faUser} className='h-7 text-icon' />
                </Link>
                <div className='h-[70%] w-[2px] bg-gradient-to-b from-transparent via-icon to-transparent' />
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
