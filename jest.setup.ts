import "@testing-library/jest-dom";

// jsdom does not implement matchMedia; emulate "(max-width: 767px)" style
// queries from window.innerWidth and re-evaluate on window resize events
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => {
    const maxWidth = query.match(/max-width:\s*(\d+)px/);

    return {
      get matches() {
        return maxWidth ? window.innerWidth <= parseInt(maxWidth[1]) : false;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: EventListener) =>
        window.addEventListener("resize", listener),
      removeEventListener: (_type: string, listener: EventListener) =>
        window.removeEventListener("resize", listener),
      addListener: (listener: EventListener) =>
        window.addEventListener("resize", listener),
      removeListener: (listener: EventListener) =>
        window.removeEventListener("resize", listener),
      dispatchEvent: () => false,
    };
  },
});
