import React from 'react';

const phrases = ['BUILD WITH INTENT', 'MAKE THE COMPLEX USEFUL', 'LEARN IN PUBLIC', 'SHIP · MEASURE · IMPROVE'];

export const MotionTicker: React.FC = () => (
  <div className="motion-ticker relative overflow-hidden border-y border-ink/10 bg-signal py-4 text-ink" aria-label="Build with intent. Make the complex useful. Learn in public. Ship, measure, improve.">
    <div className="motion-ticker-track" aria-hidden="true">
      {[0, 1].map((copy) => (
        <div className="motion-ticker-group" key={copy}>
          {phrases.map((phrase) => (
            <span className="motion-ticker-word" key={phrase}>
              {phrase}<span className="motion-ticker-star">✳</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
