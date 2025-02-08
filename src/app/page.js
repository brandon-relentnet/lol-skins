"use client";

import { useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faArrowUp, faArrowDown, faStar, faBan, faGamepad, faTrophy, faComments } from '@fortawesome/free-solid-svg-icons';
import SkinCard from "@/components/SkinCard";

const icons = [
  {
    icon: faArrowUp,
    blurb: "The coveted upvote button."
  },
  {
    icon: faArrowDown,
    blurb: "The less coveted downvote button."
  },
  {
    icon: faStar,
    blurb: "If you absolutely love a skin, give it a star! (You only get 3, use them wisely)"
  },
  {
    icon: faBan,
    blurb: "If you really hate a skin, you can ban it. (Also only 3, so choose carefully)"
  }
];

const upcomingFeatures = [
  {
    icon: faGamepad,
    title: "Skin-Based Games",
    blurb: "Compete in fun challenges that test your skin knowledge, with rewards based on community votes."
  },
  {
    icon: faTrophy,
    title: "Leaderboards & Achievements",
    blurb: "Track your votes, climb the rankings, and unlock achievements for your contributions."
  },
  {
    icon: faComments,
    title: "Community Polls & Discussions",
    blurb: "Join skin-specific discussions, vote on upcoming features, and help shape the platform."
  }
];

export default function HomePage() {
  const nextSectionRef = useRef(null);
  const comingNextRef = useRef(null);
  const voteRef = useRef(null);

  const skin = {
    id: "Thresh",
    name: "Janitor Thresh",
    splash_url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_59.jpg",
    total_votes: 0,
    champion_id: "Thresh",
  };

  return (
    <div className="container mx-auto p-4 py-26">
      {/* Hero Section */}
      <div className="h-screen w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">
          Welcome to SkinBattle.LoL!
        </h1>
        <h2 className="text-2xl mb-16 text-grey1">
          The Ultimate Champion Skin Ranking Site
        </h2>

        {/* Down Arrow */}
        <button
          onClick={() => nextSectionRef.current.scrollIntoView({ behavior: "smooth" })}
          className="animate-bounce cursor-pointer"
          aria-label="Scroll down"
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-10 w-10 p-4 text-grey1 hover:text-gold2 transition duration-300" />
        </button>
      </div>

      {/* How It Works Section */}
      <div ref={nextSectionRef} className="py-20 scroll-mt-14 flex justify-center items-center flex-col mb-26">
        <h2 className="text-4xl font-serif font-bold text-gold2 text-center mb-4">How It Works</h2>
        <p className="text-lg text-grey1 text-center max-w-2xl mx-auto mb-10">
          Tired of scrolling through endless Reddit threads trying to figure out which skin is the best?
          SkinBattle.lol is here to settle the debate once and for all!
          This is a community-driven ranking system where players like you vote on skins,
          helping create a definitive list of the best (and worst) skins for every champion.
        </p>

        <div className="mb-10 px-10 lg:px-20 xl:px-30 2xl:px-40 flex justify-center items-center space-x-6 flex-col lg:flex-row ">
          <div className="w-full lg:w-2/3 mb-6">
            <SkinCard
              key={skin.id}
              skin={skin}
              championId={skin.champion_id}
              initialVote={0}
              initialStar={false}
              initialX={false}
            />
          </div>

          <div className="flex flex-col items-start justify-between flex-1 w-full lg:w-1/3">
            {icons.map((icon, index) => (
              <div key={index} className="flex mb-10">
                <FontAwesomeIcon
                  key={index}
                  icon={icon.icon}
                  className="h-10 w-6 text-gold2 mr-2"
                />
                <span className="text-grey1">- </span>
                <p className="text-lg text-grey1">{icon.blurb}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll to What's Coming Next */}
        <button
          onClick={() => comingNextRef.current.scrollIntoView({ behavior: "smooth" })}
          className="animate-bounce cursor-pointer"
          aria-label="Scroll down"
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-10 w-10 p-4 text-grey1 hover:text-gold2 transition duration-300" />
        </button>
      </div>

      {/* What's Coming Next Section */}
      <div ref={comingNextRef} className="py-40 scroll-mt-16 lg:scroll-mt-46 flex justify-center items-center flex-col w-full mb-26">
        <h2 className="text-4xl font-serif font-bold text-gold2 text-center mb-6">What's Coming Next?</h2>
        <p className="text-lg text-grey1 text-center max-w-2xl mx-auto mb-12">
          SkinBattle.lol is just getting started! Here's a sneak peek at upcoming features that will make ranking and comparing skins even more exciting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 lg:px-20 mb-16">
          {upcomingFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <FontAwesomeIcon icon={feature.icon} className="h-12 w-12 text-gold2 mb-4" />
              <h3 className="text-xl font-serif font-bold text-gold2 mb-2">{feature.title}</h3>
              <p className="text-grey1 text-lg">{feature.blurb}</p>
            </div>
          ))}
        </div>

        {/* Scroll to What's Coming Next */}
        <button
          onClick={() => voteRef.current.scrollIntoView({ behavior: "smooth" })}
          className="animate-bounce cursor-pointer"
          aria-label="Scroll down"
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-10 w-10 p-4 text-grey1 hover:text-gold2 transition duration-300" />
        </button>
      </div>

      {/* Call to Action (CTA) Section */}
      <div ref={voteRef} className="py-40 scroll-mt-26 flex flex-col items-center justify-center w-full text-center">
        <h2 className="text-4xl font-serif font-bold text-gold2 mb-6">
          Ready to Start Voting?
        </h2>
        <p className="text-lg text-grey1 max-w-2xl mx-auto mb-8">
          Help shape the rankings and decide which skins reign supreme. Head over to the champions page and start voting on your favorites now!
        </p>
        <Link href="/champions" className="bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-4 shadow-lg">
            Vote Now
        </Link>
      </div>
    </div>
  );
}
