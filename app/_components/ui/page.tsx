"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`p-5 lg:px-8 space-y-6  ${className || ""} `}>
      {children}
    </div>
  );
};

export const PageSectionTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={`text-xs text-foreground uppercase font-semibold ${className || ""}`}
    >
      {children}
    </h2>
  );
};

export const PageSection = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-3">{children}</div>;
};

export const PageSectionScroller = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
};

export const PageBanner = ({
  src,
  children,
  className,
}: {
  src?: string | undefined;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section className={`flex w-full overflow-hidden ${className || ""}`}>
      <Image
        src={src || ""}
        alt=""
        fill
        className="object-cover w-full h-full"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background/90" />
      <div className="relative w-full min-w-0">{children}</div>
    </section>
  );
};

export const SectionScrollerWithArrows = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative px-10">
      {/* Botão Esquerda */}
      <button
        onClick={() => scroll("left")}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${
          canScrollLeft
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-4 pointer-events-none"
        }`}
        aria-label="Rolar para esquerda"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="57"
          height="57"
          viewBox="0 0 57 57"
          fill="none"
        >
          <path
            d="M28.5 56C43.6878 56 56 43.6878 56 28.5C56 13.3122 43.6878 1 28.5 1C13.3122 1 1 13.3122 1 28.5C1 43.6878 13.3122 56 28.5 56Z"
            className="fill-primary"
          />
        </svg>
        <ChevronLeft className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 text-primary-foreground" />
      </button>

      {/* Lista scrollável */}
      <div
        ref={scrollRef}
        className="flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {Array.isArray(children)
          ? children.map((child, index) => (
              <div
                key={index}
                className="snap-start shrink-0 transition-all duration-500 ease-out"
              >
                {child}
              </div>
            ))
          : children}
      </div>

      {/* Botão Direita */}
      <button
        onClick={() => scroll("right")}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${
          canScrollRight
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-4 pointer-events-none"
        }`}
        aria-label="Rolar para direita"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="57"
          height="57"
          viewBox="0 0 57 57"
          fill="none"
        >
          <path
            d="M28.5 56C43.6878 56 56 43.6878 56 28.5C56 13.3122 43.6878 1 28.5 1C13.3122 1 1 13.3122 1 28.5C1 43.6878 13.3122 56 28.5 56Z"
            className="fill-primary"
          />
        </svg>
        <ChevronRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 text-primary-foreground" />
      </button>
    </div>
  );
};
