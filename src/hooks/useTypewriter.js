import { useEffect, useState } from 'react';

const useTypewriter = (text, speed = 70, startDelay = 300) => {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let timeoutId;
    let currentIndex = 0;

    const startTimer = setTimeout(() => {
      const type = () => {
        if (currentIndex <= text.length) {
          setTypedText(text.slice(0, currentIndex));
          currentIndex += 1;
          timeoutId = setTimeout(type, speed);
        }
      };

      type();
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timeoutId);
    };
  }, [text, speed, startDelay]);

  return typedText;
};

export default useTypewriter;
