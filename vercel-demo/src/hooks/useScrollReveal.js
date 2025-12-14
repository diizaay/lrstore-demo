import { useEffect } from "react";

export default function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate]");

    if (!elements.length) return;

    // Se o browser não suporta IntersectionObserver, deixa tudo visível
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("animate-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target); // anima só uma vez
          }
        });
      },
      {
        threshold: 0.15, // 15% do elemento visível dispara a animação
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
