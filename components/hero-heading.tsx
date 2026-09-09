import type { CSSProperties } from "react";

const phrases = ["Learn together.", "Build what's next."];

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
                  const letterCount = phrase.replaceAll(" ", "").length;
                  const distance = Math.abs(letterIndex - (letterCount - 1) / 2);
                  const style = {
                    "--letter-delay": `${180 + phraseIndex * 320 + distance * 65}ms`,
                    ...(phraseIndex === 1 ? {
                      backgroundSize: `${phrase.length * 100}% 100%`,
                      backgroundPosition: `${offset / (phrase.length - 1) * 100}% 0`,
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
