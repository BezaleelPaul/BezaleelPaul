import React from 'react';

interface AnimatedWordsProps {
  text: string;
  accentWords?: string[];
  className?: string;
}

/** Accessible word-by-word reveal. The original phrase remains available to assistive technology. */
export const AnimatedWords: React.FC<AnimatedWordsProps> = ({
  text,
  accentWords = [],
  className = '',
}) => {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true" className="animated-words">
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            {index > 0 ? ' ' : null}
            <span className="word-mask">
              <span data-word-reveal className={accentWords.includes(word) ? 'word-accent' : undefined}>
                {word}
              </span>
            </span>
          </React.Fragment>
        ))}
      </span>
    </span>
  );
};
