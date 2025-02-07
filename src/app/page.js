"use client";

import { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function HomePage() {
  const nextSectionRef = useRef(null);

  const scrollToNextSection = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto p-4 mt-26">
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
      <div ref={nextSectionRef} className="py-20 scroll-mt-26">
        <h2 className="text-3xl font-bold text-gold2 text-center mb-4">How It Works</h2>
        <p className="text-lg text-grey1 text-center max-w-2xl mx-auto">
          Tired of scrolling through endless Reddit threads trying to figure out which skin is the best?
          SkinBattle.lol is here to settle the debate once and for all!
          This is a community-driven ranking system where players like you vote on skins,
          helping create a definitive list of the best (and worst) skins for every champion.
        </p>
      </div>

      {/* Next Section */}
      <div className="py-20">
        <h2 className="text-3xl font-bold text-gold2 text-center mb-4">How It Works</h2>
        <p className="text-lg text-grey1 text-center max-w-2xl mx-auto">
          Tired of scrolling through endless Reddit threads trying to figure out which skin is the best?
          SkinBattle.lol is here to settle the debate once and for all!
          This is a community-driven ranking system where players like you vote on skins,
          helping create a definitive list of the best (and worst) skins for every champion.
        </p>
      </div>

      {/* Next Section */}
      <div className="py-20">
        <h2 className="text-3xl font-bold text-gold2 text-center mb-4">How It Works</h2>
        <p className="text-lg text-grey1 text-center max-w-2xl mx-auto">
          Tired of scrolling through endless Reddit threads trying to figure out which skin is the best?
          SkinBattle.lol is here to settle the debate once and for all!
          This is a community-driven ranking system where players like you vote on skins,
          helping create a definitive list of the best (and worst) skins for every champion.
        </p>
      </div>
    </div>
  );
}
