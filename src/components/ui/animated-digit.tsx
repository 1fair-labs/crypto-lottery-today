import { useEffect, useState, useRef } from 'react';

interface AnimatedDigitProps {
  digit: string;
  previousDigit: string | null;
  className?: string;
}

export function AnimatedDigit({ digit, previousDigit, className = '' }: AnimatedDigitProps) {
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (previousDigit !== null && previousDigit !== digit) {
      setIsAnimating(true);
      
      // Анимация прокрутки от старой цифры к новой
      const startNum = parseInt(previousDigit) || 0;
      const endNum = parseInt(digit) || 0;
      const diff = endNum - startNum;
      const steps = Math.abs(diff) + 1;
      const duration = 400; // 400ms
      const stepTime = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          const currentNum = startNum + (diff > 0 ? currentStep : -currentStep);
          setDisplayDigit(String(currentNum % 10));
        } else {
          setDisplayDigit(digit);
          setIsAnimating(false);
          clearInterval(interval);
        }
      }, stepTime);
      
      return () => clearInterval(interval);
    } else {
      setDisplayDigit(digit);
    }
  }, [digit, previousDigit]);

  return (
    <span 
      ref={containerRef}
      className={`inline-block ${isAnimating ? 'animate-pulse' : ''} ${className}`}
      style={{
        minWidth: '0.5em',
        textAlign: 'center'
      }}
    >
      {displayDigit}
    </span>
  );
}

