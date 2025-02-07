"use client";

import { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faArrowUp, faArrowDown, faStar, faBan } from '@fortawesome/free-solid-svg-icons';
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

export default function HomePage() {
  const nextSectionRef = useRef(null);

  const scrollToNextSection = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const skin = {
    id: "Thresh",
    name: "Janitor Thresh",
    splash_url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_59.jpg",
    total_votes: 0,
    champion_id: "Thresh",
  };

  return (
    <>
      {/* Hero Section */}
      <div className="h-screen w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">
          Welcome to SkinBattle.LoL!
        </h1>
        <h2 className="text-2xl mb-6 text-grey1">
          The Ultimate Champion Skin Ranking Site
        </h2>

        {/* Down Arrow */}
        <button
          onClick={scrollToNextSection}
          className="mt-10 animate-bounce"
          aria-label="Scroll down"
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-10 w-10 text-grey1 hover:text-gold2 transition duration-300" />
        </button>
      </div>

      {/* Next Section */}
      <div ref={nextSectionRef} className="py-20 scroll-mt-26 flex justify-center items-center flex-col">
        <h2 className="text-3xl font-bold text-gold2 text-center mb-4">How It Works</h2>
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
      </div>
    </>
  );
}
