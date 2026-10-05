import type { CSSProperties } from "react";

const phrases = ["Learn together.", "Build what's next."];
const totalWords = phrases.flatMap(phrase => phrase.split(" ")).length;
const sweepDelay = 100 + (totalWords - 1) * 85 + 1800 + 350;

export function HeroHeading() {
  return (
    <h1 className="hero-heading" aria-label="Learn together. Build what's next.">
      {phrases.map((phrase, phraseIndex) => (
        <span className="hero-heading__phrase" aria-hidden="true" key={phrase}>
          {phraseIndex > 0 && <br />}
          {phrase.split(" ").map((word, wordIndex, words) => (
            <span key={word}>
              <span className="hero-heading__word" style={{
                "--word-delay": `${100 + (phrases.slice(0, phraseIndex).flatMap(previous => previous.split(" ")).length + wordIndex) * 85}ms`,
              } as CSSProperties}>
                {[...word].map((letter, index) => {
                  const offset = words.slice(0, wordIndex).join(" ").length + (wordIndex ? 1 : 0) + index;
                  const letterIndex = offset - wordIndex;
                  const style = {
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
