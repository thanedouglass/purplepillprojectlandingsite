/**
 * Hero Typewriter Effect
 */

const words = [
  "felt.",
  "lived.",
  "unlearned.",
  "seen from the inside.",
  "confronted."
];

const typeSpeed = 60;
const deleteSpeed = 35;
const waitTime = 1800;

function initTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  if (!textElement) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeedCurrent = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at end of word
      typeSpeedCurrent = wordIndex === words.length - 1 ? waitTime * 2 : waitTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeedCurrent = 500; // brief pause before typing next word
    }

    setTimeout(type, typeSpeedCurrent);
  }

  // Inject blinking cursor style
  if (!document.getElementById('typewriter-cursor-style')) {
    const style = document.createElement('style');
    style.id = 'typewriter-cursor-style';
    style.innerHTML = `
      #typewriter-cursor {
        animation: typewriter-blink 1s step-end infinite;
      }
      @keyframes typewriter-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(type, 1000); // Initial delay
}

// Execute immediately since the component-loader imports this after HTML is injected
initTypewriter();