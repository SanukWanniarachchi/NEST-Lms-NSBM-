import type { CSSProperties } from "react";

const phrases = ["Learn together.", "Build what's next."];
const totalLetters = phrases.join("").replaceAll(" ", "").length;
const sweepDelay = 120 + (totalLetters - 1) * 36 + 950 + 350;

export function HeroHeading() {
  return (
    <h1 className="hero-heading" aria-label="Learn together. Build what's next.">
      {phrases.map((phrase, phraseIndex) => (
        <span className="hero-heading__phrase" aria-hidden="true" key={phrase}>
          {phraseIndex > 0 && <br />}
          {phrase.split(" ").map((word, wordIndex, words) => (
            <span key={word}>
              <span className="hero-heading__word">
                {[...word].map((letter, index) => {
                  const offset = words.slice(0, wordIndex).join(" ").length + (wordIndex ? 1 : 0) + index;
                  const letterIndex = offset - wordIndex;
                  const entranceIndex = phrases.slice(0, phraseIndex).join("").replaceAll(" ", "").length + letterIndex;
                  const style = {
                    "--letter-delay": `${120 + entranceIndex * 36}ms`,
                    ...(phraseIndex === 1 ? {
                      "--sweep-delay": `${sweepDelay}ms`,
                      "--sweep-start": `${letterIndex * 4}% 50%`,
                      "--sweep-end": `${letterIndex * 4 + 1000 / 9}% 50%`,
                    } : {}),
                  } as CSSProperties;
                  return <span className={`hero-heading__letter${phraseIndex === 1 ? " hero-heading__letter--accent" : ""}`} style={style} key={index}>{letter}</span>;
                })}
              </span>{wordIndex < words.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
