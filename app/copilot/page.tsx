"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { X, Bot, Bookmark, BookmarkCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Filters = {
  marketCap?: number;
  uniqueHolders?: number;
  selectedTypes?: string[];
  safeScan?: boolean;
};

type CreatorProfile = {
  handle?: string;
  avatar?: {
    previewImage?: {
      medium?: string;
    };
  };
};

export type Memecoin = {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  marketCap: string;
  marketCapValue?: number;
  uniqueHolders: string;
  uniqueHoldersValue?: number;
  volume24h: string;
  address?: string;
  totalSupply?: string;
  createdAt?: string;
  creatorAddress?: string;
  creatorProfile?: CreatorProfile;
  marketCapDelta24h?: number;
  tags?: string[];
  safeScan?: boolean;
  color?: string;
};

const mockMemecoins: Memecoin[] = [
  {
    id: "zwipe",
    name: "Zwipe",
    symbol: "ZWIPE",
    description:
      "A playful memecoin empowering degens to swipe their next favorite token with style.",
    marketCap: "$5.2M",
    marketCapValue: 5200000,
    uniqueHolders: "4,582",
    uniqueHoldersValue: 4582,
    volume24h: "$650K",
    marketCapDelta24h: 18.6,
    address: "0x1234abcd5678efgh9012ijkl3456mnop7890qrst",
    totalSupply: "1,000,000,000",
    createdAt: "2024-04-21T00:00:00Z",
    creatorAddress: "0xabcd1234abcd1234abcd1234abcd1234abcd1234",
    creatorProfile: {
      handle: "mememaster",
      avatar: {
        previewImage: {
          medium: "/polypuff.svg",
        },
      },
    },
    tags: ["Meme", "Community"],
    safeScan: true,
  },
  {
    id: "smol",
    name: "Smol Fish",
    symbol: "SMOL",
    description:
      "Smol Fish swims the Base ocean looking for the next wave of virality.",
    marketCap: "$1.3M",
    marketCapValue: 1300000,
    uniqueHolders: "1,102",
    uniqueHoldersValue: 1102,
    volume24h: "$210K",
    marketCapDelta24h: -6.3,
    address: "0x4567abcd5678efgh9012ijkl3456mnop7890qrst",
    totalSupply: "420,000,000",
    createdAt: "2024-05-02T00:00:00Z",
    creatorAddress: "0xef981234abcd1234abcd1234abcd1234abcd5678",
    creatorProfile: {
      handle: "fishfan",
      avatar: {
        previewImage: {
          medium: "/globe.svg",
        },
      },
    },
    tags: ["Meme"],
    safeScan: true,
  },
  {
    id: "vault",
    name: "Vault Labs",
    symbol: "VAULT",
    description:
      "Vault Labs rewards builders for experimenting with onchain experiences.",
    marketCap: "$12.8M",
    marketCapValue: 12800000,
    uniqueHolders: "10,918",
    uniqueHoldersValue: 10918,
    volume24h: "$1.8M",
    marketCapDelta24h: 32.1,
    address: "0x72afabcd5678efgh9012ijkl3456mnop7890qrst",
    totalSupply: "100,000,000",
    createdAt: "2024-01-14T00:00:00Z",
    creatorAddress: "0xef751234abcd1234abcd1234abcd1234abcd9000",
    creatorProfile: {
      handle: "vaultlabs",
    },
    tags: ["Utility", "Community"],
    safeScan: false,
  },
  {
    id: "astro",
    name: "Astro Ape",
    symbol: "APE-X",
    description:
      "Astro Ape is a cosmic meme mission rallying apes to explore new chains.",
    marketCap: "$3.4M",
    marketCapValue: 3400000,
    uniqueHolders: "2,274",
    uniqueHoldersValue: 2274,
    volume24h: "$420K",
    marketCapDelta24h: 9.8,
    address: "0x9012abcd5678efgh9012ijkl3456mnop7890qrst",
    totalSupply: "777,777,777",
    createdAt: "2024-03-09T00:00:00Z",
    creatorAddress: "0xef111234abcd1234abcd1234abcd1234abcd3333",
    creatorProfile: {
      handle: "astrobro",
      avatar: {
        previewImage: {
          medium: "/window.svg",
        },
      },
    },
    tags: ["Meme", "Game"],
    safeScan: true,
  },
  {
    id: "glyph",
    name: "Glyph Protocol",
    symbol: "GLYPH",
    description:
      "Glyph powers creative tooling for artists spinning up custom memecoins on Base.",
    marketCap: "$980K",
    marketCapValue: 980000,
    uniqueHolders: "684",
    uniqueHoldersValue: 684,
    volume24h: "$92K",
    marketCapDelta24h: 4.2,
    address: "0xc0deabcd5678efgh9012ijkl3456mnop7890qrst",
    totalSupply: "250,000,000",
    createdAt: "2024-02-26T00:00:00Z",
    creatorAddress: "0xefdd1234abcd1234abcd1234abcd1234abcd7777",
    creatorProfile: {
      handle: "glyphdev",
    },
    tags: ["Utility"],
    safeScan: true,
  },
];

const colorPalette = [
  "from-pink-400 to-purple-500",
  "from-yellow-400 to-orange-500",
  "from-green-400 to-lime-500",
  "from-blue-400 to-cyan-500",
  "from-indigo-400 to-blue-500",
  "from-red-400 to-pink-500",
  "from-purple-400 to-indigo-500",
];

function assignColorToCoin(coin: Memecoin, index: number): Memecoin {
  const key = coin.id || String(index);
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash += key.charCodeAt(i);
  }
  const color = colorPalette[hash % colorPalette.length];
  return { ...coin, color };
}

function getSuggestedTokens(currentId: string, coins: Memecoin[]): Memecoin[] {
  if (!coins.length) return [];
  const filtered = coins.filter((coin) => coin.id !== currentId);
  return filtered.slice(0, 4);
}

export default function CopilotPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memecoins, setMemecoins] = useState<Memecoin[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bookmarkedCoins, setBookmarkedCoins] = useState<Set<string>>(
    () => new Set()
  );
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showStamp, setShowStamp] = useState<
    "buy" | "pass" | "bookmark" | null
  >(null);
  const [exitAnimation, setExitAnimation] = useState<{
    direction: "left" | "right";
  } | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [showHydrationLoader, setShowHydrationLoader] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const timer = window.setTimeout(
        () => setShowHydrationLoader(false),
        2000
      );
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [mounted]);

  const fetchMemecoins = useCallback(
    async (activeFilters?: Filters) => {
      const appliedFilters = activeFilters ?? filters;
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        let coins = [...mockMemecoins];

        if (appliedFilters.marketCap !== undefined) {
          coins = coins.filter(
            (coin) =>
              (coin.marketCapValue ?? 0) >= (appliedFilters.marketCap ?? 0)
          );
        }

        if (appliedFilters.uniqueHolders !== undefined) {
          coins = coins.filter(
            (coin) =>
              (coin.uniqueHoldersValue ?? 0) >=
              (appliedFilters.uniqueHolders ?? 0)
          );
        }

        if (
          appliedFilters.selectedTypes &&
          appliedFilters.selectedTypes.length > 0
        ) {
          coins = coins.filter((coin) => {
            if (!coin.tags?.length) return false;
            return appliedFilters.selectedTypes?.some((type) =>
              coin.tags?.includes(type)
            );
          });
        }

        if (appliedFilters.safeScan !== undefined) {
          coins = coins.filter(
            (coin) => coin.safeScan === appliedFilters.safeScan
          );
        }

        setMemecoins(coins.map(assignColorToCoin));
        setCurrentIndex(0);
      } catch (error) {
        console.error("Failed to fetch memecoins", error);
        setMemecoins(mockMemecoins.map(assignColorToCoin));
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchMemecoins();
  }, [fetchMemecoins]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) {
      const timer = window.setTimeout(() => setShowSplash(false), 1500);
      return () => window.clearTimeout(timer);
    }
    setShowSplash(false);
    return undefined;
  }, []);

  const currentCoin = memecoins[currentIndex];
  const atEnd = currentIndex >= memecoins.length;

  const suggestedTokens = useMemo(
    () => getSuggestedTokens(currentCoin?.id ?? "", memecoins),
    [currentCoin?.id, memecoins]
  );

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating || isExpanded || showSuggestions || atEnd) return;
    if (!currentCoin) return;

    setIsAnimating(true);
    setShowStamp(direction === "right" ? "buy" : "pass");

    if (direction === "left") {
      window.setTimeout(() => {
        setExitAnimation({ direction: "left" });
        window.setTimeout(() => {
          completeSwipe();
        }, 600);
      }, 800);
    } else {
      window.setTimeout(() => {
        setShowBuyDialog(true);
        setIsAnimating(false);
        setShowStamp(null);
      }, 800);
    }
  };

  const completeSwipe = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsAnimating(false);
    setShowStamp(null);
    setExitAnimation(null);
    setDragOffset({ x: 0, y: 0 });
    setIsExpanded(false);
    setShowSuggestions(false);
  };

  const beginDrag = (clientX: number, clientY: number) => {
    if (isExpanded || showSuggestions) return;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const updateDrag = (clientX: number, clientY: number) => {
    if (!isDragging || isExpanded || showSuggestions) return;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const endDrag = () => {
    if (!isDragging || isExpanded || showSuggestions) return;
    setIsDragging(false);
    if (Math.abs(dragOffset.x) > 100) {
      handleSwipe(dragOffset.x > 0 ? "right" : "left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    beginDrag(event.clientX, event.clientY);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateDrag(event.clientX, event.clientY);
  };

  const handleMouseUp = () => {
    endDrag();
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    beginDrag(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = event.touches[0];
    updateDrag(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleSuggestions = () => {
    setShowSuggestions((prev) => !prev);
    setIsExpanded(false);
  };

  const handleSuggestionClick = (coin: Memecoin) => {
    const coinIndex = memecoins.findIndex((c) => c.id === coin.id);
    if (coinIndex !== -1) {
      setCurrentIndex(coinIndex);
      setShowSuggestions(false);
      setIsExpanded(true);
      return;
    }
    setMemecoins((prev) => [assignColorToCoin(coin, 0), ...prev]);
    setCurrentIndex(0);
    setShowSuggestions(false);
    setIsExpanded(true);
  };

  const toggleBookmark = () => {
    if (!currentCoin) return;
    setBookmarkedCoins((prev) => {
      const updated = new Set(prev);
      if (updated.has(currentCoin.id)) {
        updated.delete(currentCoin.id);
      } else {
        updated.add(currentCoin.id);
        setShowStamp("bookmark");
        window.setTimeout(() => {
          setShowStamp(null);
        }, 1500);
      }
      return updated;
    });
  };

  const getCardStyle = (): CSSProperties => {
    if (exitAnimation) {
      return {
        transform: `translateX(${
          exitAnimation.direction === "left" ? "-100vw" : "100vw"
        }) rotate(${exitAnimation.direction === "left" ? "-30deg" : "30deg"})`,
        opacity: 0,
        transition: "all 0.6s ease-out",
        zIndex: 20,
      };
    }

    if (isDragging && !isExpanded && !showSuggestions) {
      return {
        transform: `translateX(${dragOffset.x}px) translateY(${
          dragOffset.y
        }px) rotate(${dragOffset.x * 0.1}deg)`,
        zIndex: 20,
        transition: "none",
      };
    }

    return {
      transform: "none",
      zIndex: 20,
      transition: "none",
    };
  };

  const cardHeight = isExpanded || showSuggestions ? "660px" : "580px";

  if (showHydrationLoader) {
    return <CopilotSkeleton />;
  }

  if (showSplash) {
    return <CopilotSkeleton />;
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-white px-4 pb-10 pt-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="relative mb-4" style={{ height: cardHeight }}>
          {loading ? (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-black/30 backdrop-blur">
              <CircleLoader size={64} />
            </div>
          ) : (
            <>
              {!isExpanded &&
                !showSuggestions &&
                !atEnd &&
                memecoins
                  .slice(currentIndex + 1, currentIndex + 3)
                  .map((coin, index) => (
                    <Card
                      key={coin.id}
                      className="absolute inset-0 border-4 border-white/20 shadow-2xl"
                      style={{
                        transform: `scale(${0.85 - index * 0.05}) translateY(${
                          index * 24
                        }px)`,
                        zIndex: 10 - index,
                        background: getGradientFromColorString(
                          coin.color ??
                            colorPalette[index % colorPalette.length]
                        ),
                        opacity: 0.7 - index * 0.2,
                        transition:
                          "transform 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      <CardContent className="flex h-full flex-col p-0">
                        <div className="flex-1 rounded-t-xl bg-black/10" />
                      </CardContent>
                    </Card>
                  ))}

              {showSuggestions && !atEnd && (
                <SuggestionsView
                  suggestedTokens={suggestedTokens}
                  bookmarkedCoins={bookmarkedCoins}
                  onSuggestionClick={handleSuggestionClick}
                  onBack={toggleSuggestions}
                />
              )}

              {!showSuggestions && !atEnd && currentCoin && (
                <MemecoinCard
                  coin={currentCoin}
                  isExpanded={isExpanded}
                  getCardStyle={getCardStyle}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onToggleExpanded={toggleExpanded}
                />
              )}

              {atEnd && (
                <Card className="flex h-full flex-col items-center justify-center border-4 border-white/30 bg-gradient-to-br from-gray-800 to-slate-900 text-center shadow-2xl">
                  <CardContent className="flex h-full flex-col items-center justify-center gap-4 p-8">
                    <div className="text-5xl">😅</div>
                    <h2 className="text-2xl font-semibold text-white">
                      Oops! No more coins to show.
                    </h2>
                    <p className="text-xl text-gray-300">
                      Try changing the filters
                    </p>
                  </CardContent>
                </Card>
              )}

              {isDragging && !isExpanded && !showSuggestions && !atEnd && (
                <>
                  <div
                    className="absolute left-8 top-20 -rotate-12 rounded-full border-4 border-white bg-red-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-opacity"
                    style={{ opacity: dragOffset.x < -50 ? 1 : 0 }}
                  >
                    NOPE!
                  </div>
                  <div
                    className="absolute right-8 top-20 rotate-12 rounded-full border-4 border-white bg-lime-400 px-6 py-3 text-lg font-semibold text-black shadow-lg transition-opacity"
                    style={{ opacity: dragOffset.x > 50 ? 1 : 0 }}
                  >
                    BUY!
                  </div>
                </>
              )}

              {showStamp && !atEnd && (
                <div
                  className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
                  style={{
                    opacity: exitAnimation ? 0 : 1,
                    transition: exitAnimation
                      ? "opacity 0.6s ease-out"
                      : "none",
                  }}
                >
                  <div
                    className={cn(
                      "text-7xl px-12 py-6 border-8 rounded-2xl rotate-12 shadow-2xl animate-pulse font-bold uppercase tracking-widest",
                      showStamp === "buy" &&
                        "text-lime-400 border-lime-400 bg-lime-50",
                      showStamp === "pass" &&
                        "text-red-500 border-red-500 bg-red-50",
                      showStamp === "bookmark" &&
                        "text-yellow-500 border-yellow-500 bg-yellow-50"
                    )}
                    style={{
                      textShadow: "4px 4px 0px rgba(0,0,0,0.3)",
                      animation: "stamp 0.8s ease-out",
                    }}
                  >
                    {showStamp === "buy"
                      ? "BOUGHT!"
                      : showStamp === "pass"
                      ? "PASSED!"
                      : "SAVED!"}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!isExpanded && !showSuggestions && (
          <div className="flex items-center justify-center gap-3 md:gap-6">
            <button
              type="button"
              onClick={toggleSuggestions}
              className="relative flex h-14 w-14 items-center justify-center rounded-full border-6 border-white bg-gradient-to-br from-purple-500 to-purple-700 p-0 text-white shadow-2xl transition-all duration-200 hover:scale-110 md:h-20 md:w-20"
              title="CoinCierge AI Suggestions"
              disabled={!currentCoin}
            >
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-400/20 to-pink-400/20" />
              <Bot
                className="relative z-10 h-7 w-7 drop-shadow-lg md:h-8 md:w-8"
                strokeWidth={3}
              />
            </button>

            <Button
              size="icon"
              className="h-14 w-14 rounded-full border-6 border-white bg-gradient-to-br from-red-500 to-red-700 p-0 text-white shadow-2xl transition-all duration-200 hover:scale-110 md:h-20 md:w-20"
              onClick={() => handleSwipe("left")}
              disabled={isAnimating || !currentCoin}
              title="Pass"
            >
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-red-400/20 to-orange-400/20" />
              <X
                className="relative z-10 mx-auto my-auto h-7 w-7 drop-shadow-lg md:h-10 md:w-10"
                strokeWidth={4}
              />
            </Button>

            <Button
              size="icon"
              className="h-14 w-14 rounded-full border-6 border-white bg-gradient-to-br from-lime-400 to-green-500 p-0 text-black shadow-2xl transition-all duration-200 hover:scale-110 md:h-20 md:w-20"
              onClick={() => handleSwipe("right")}
              disabled={isAnimating || !currentCoin}
              title="Buy"
            >
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-300/30 to-lime-300/30" />
              <Check
                className="relative z-10 mx-auto my-auto h-7 w-7 drop-shadow-lg md:h-10 md:w-10"
                strokeWidth={4}
              />
            </Button>

            <button
              type="button"
              onClick={toggleBookmark}
              className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-full border-6 border-white p-0 text-white shadow-2xl transition-all duration-200 hover:scale-110 md:h-20 md:w-20",
                currentCoin && bookmarkedCoins.has(currentCoin.id)
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                  : "bg-gradient-to-br from-gray-600 to-gray-800"
              )}
              title={
                currentCoin && bookmarkedCoins.has(currentCoin.id)
                  ? "Remove from bookmarks"
                  : "Save for later"
              }
              disabled={!currentCoin}
            >
              <div
                className={cn(
                  "absolute inset-0 animate-pulse",
                  currentCoin && bookmarkedCoins.has(currentCoin.id)
                    ? "bg-gradient-to-r from-yellow-300/20 to-orange-300/20"
                    : "bg-gradient-to-r from-gray-400/20 to-gray-600/20"
                )}
              />
              {currentCoin && bookmarkedCoins.has(currentCoin.id) ? (
                <BookmarkCheck
                  className="relative z-10 h-7 w-7 drop-shadow-lg md:h-8 md:w-8"
                  strokeWidth={3}
                />
              ) : (
                <Bookmark
                  className="relative z-10 h-7 w-7 drop-shadow-lg md:h-8 md:w-8"
                  strokeWidth={3}
                />
              )}
            </button>
          </div>
        )}

        {currentCoin && (
          <BuyDialog
            open={showBuyDialog}
            onOpenChange={setShowBuyDialog}
            coin={currentCoin}
            onBuySuccess={() => {
              setShowBuyDialog(false);
              completeSwipe();
            }}
          />
        )}

        <CreateCoinDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />

        <FilterDialog
          open={showFilterDialog}
          onOpenChange={setShowFilterDialog}
          onApply={(newFilters) => {
            setFilters(newFilters);
            fetchMemecoins(newFilters);
          }}
          initialFilters={filters}
          availableTypes={Array.from(
            new Set(mockMemecoins.flatMap((coin) => coin.tags ?? []))
          )}
        />
      </div>

      <style jsx>{`
        @keyframes stamp {
          0% {
            transform: scale(0) rotate(12deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(12deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(12deg);
            opacity: 1;
          }
        }
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
}

const colorMap: Record<string, string> = {
  "from-pink-400": "#f472b6",
  "to-purple-500": "#a78bfa",
  "from-yellow-400": "#facc15",
  "to-orange-500": "#f97316",
  "from-green-400": "#4ade80",
  "to-lime-500": "#84cc16",
  "from-blue-400": "#60a5fa",
  "to-cyan-500": "#06b6d4",
  "from-indigo-400": "#818cf8",
  "to-blue-500": "#3b82f6",
  "from-red-400": "#f87171",
  "to-pink-500": "#ec4899",
  "from-purple-400": "#a78bfa",
  "to-indigo-500": "#6366f1",
};

function getGradientFromColorString(colorString: string) {
  const [from, to] = colorString.split(" ");
  const fromColor = colorMap[from] ?? "#f472b6";
  const toColor = colorMap[to] ?? "#a78bfa";
  return `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)`;
}

type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-white/10 bg-white/95 shadow-xl backdrop-blur",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "default" | "icon";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        size === "icon" && "h-10 w-10 p-0",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

const Badge = ({ className, ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-600",
      className
    )}
    {...props}
  />
);

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-md bg-slate-200/80 animate-pulse",
      className
    )}
  >
    <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

const CopilotSkeleton = () => (
  <>
    <div className="flex min-h-screen items-start justify-center bg-white px-4 pb-10 pt-12">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="relative" style={{ height: "580px" }}>
          <div className="pointer-events-none absolute inset-0 translate-y-12 scale-90 rounded-[32px] border border-slate-200/60 bg-slate-100 shadow-sm" />
          <div className="pointer-events-none absolute inset-0 translate-y-6 scale-95 rounded-[32px] border border-slate-200/70 bg-white shadow-md" />
          <div className="absolute inset-0 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-t-[32px] bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 animate-[gradientShift_6s_ease-in-out_infinite]">
                <SkeletonBlock className="h-32 w-32 rounded-full bg-white/80" />
                <div className="w-full space-y-2 px-12 text-center">
                  <SkeletonBlock className="mx-auto h-4 w-24 bg-white/80" />
                  <SkeletonBlock className="mx-auto h-6 w-32 bg-white/70" />
                </div>
              </div>
              <div className="space-y-4 rounded-b-[32px] bg-white px-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <SkeletonBlock className="h-24 rounded-2xl bg-slate-100" />
                  <SkeletonBlock className="h-24 rounded-2xl bg-slate-100" />
                  <SkeletonBlock className="h-24 rounded-2xl bg-slate-100" />
                  <SkeletonBlock className="h-24 rounded-2xl bg-slate-100" />
                </div>
                <SkeletonBlock className="h-16 rounded-2xl bg-slate-100" />
                <SkeletonBlock className="h-32 rounded-2xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-6">
          <SkeletonBlock className="h-14 w-14 rounded-full bg-slate-200 md:h-20 md:w-20" />
          <SkeletonBlock className="h-14 w-14 rounded-full bg-slate-200 md:h-20 md:w-20" />
          <SkeletonBlock className="h-14 w-14 rounded-full bg-slate-200 md:h-20 md:w-20" />
          <SkeletonBlock className="h-14 w-14 rounded-full bg-slate-200 md:h-20 md:w-20" />
        </div>
      </div>
    </div>
    <style jsx global>{`
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `}</style>
  </>
);

const CircleLoader = ({ size = 48 }: { size?: number }) => (
  <div
    className="animate-spin rounded-full border-4 border-white/20 border-t-white"
    style={{ height: size, width: size }}
  />
);

type SuggestionsViewProps = {
  suggestedTokens: Memecoin[];
  bookmarkedCoins: Set<string>;
  onSuggestionClick: (coin: Memecoin) => void;
  onBack: () => void;
};

function SuggestionsView({
  suggestedTokens,
  bookmarkedCoins,
  onSuggestionClick,
  onBack,
}: SuggestionsViewProps) {
  return (
    <Card className="absolute inset-0 z-30 border-4 border-white/30 bg-white/95 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-900">
          CoinCierge Suggestions
        </h3>
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          onClick={onBack}
        >
          Close
        </Button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto">
        {suggestedTokens.map((coin) => (
          <button
            key={coin.id}
            type="button"
            onClick={() => onSuggestionClick(coin)}
            className="flex items-center justify-between rounded-2xl border border-purple-100 bg-gradient-to-r from-white to-purple-50 px-4 py-3 text-left shadow-sm transition hover:shadow-lg"
          >
            <div>
              <div className="text-lg font-semibold text-slate-900">
                {coin.name}
              </div>
              <div className="text-sm text-slate-600">${coin.symbol}</div>
            </div>
            {bookmarkedCoins.has(coin.id) ? (
              <BookmarkCheck className="h-6 w-6 text-amber-500" />
            ) : (
              <Bookmark className="h-6 w-6 text-slate-500" />
            )}
          </button>
        ))}

        {suggestedTokens.length === 0 && (
          <div className="text-center text-slate-500">
            No suggestions available right now.
          </div>
        )}
      </div>
    </Card>
  );
}

type BuyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coin: Memecoin;
  onBuySuccess: () => void;
};

function BuyDialog({ open, onOpenChange, coin, onBuySuccess }: BuyDialogProps) {
  const [amount, setAmount] = useState("100");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <Card className="w-full max-w-sm border border-white/30 bg-white">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">
              Buy {coin.symbol}
            </h3>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full bg-slate-100 p-1 text-slate-500 transition hover:bg-slate-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-slate-600">
            Enter the amount of USDC you want to spend on {coin.name}.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Amount (USDC)
            </label>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              type="number"
              min={10}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Approx. Tokens</span>
            <span className="font-semibold text-slate-900">
              {(Number(amount) / 0.5).toFixed(0)} {coin.symbol}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              className="bg-slate-200 text-slate-700 hover:bg-slate-300"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-lime-400 to-green-500 text-slate-900 hover:from-lime-300 hover:to-green-400"
              onClick={onBuySuccess}
            >
              Confirm Purchase
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type CreateCoinDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function CreateCoinDialog({ open, onOpenChange }: CreateCoinDialogProps) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setSymbol("");
      setDescription("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <Card className="w-full max-w-md border border-white/30 bg-white">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">
              Launch a Memecoin
            </h3>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full bg-slate-100 p-1 text-slate-500 transition hover:bg-slate-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Coin Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              placeholder="My Meme Coin"
            />
          </div>

          <div className="grid gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Symbol
            </label>
            <input
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              placeholder="MEME"
              maxLength={5}
            />
          </div>

          <div className="grid gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[120px] rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              placeholder="What makes your memecoin special?"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              className="bg-slate-200 text-slate-700 hover:bg-slate-300"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
              onClick={() => {
                console.log("Create coin payload", {
                  name,
                  symbol,
                  description,
                });
                onOpenChange(false);
              }}
            >
              Draft Coin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type FilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: Filters) => void;
  initialFilters: Filters;
  availableTypes: string[];
};

function FilterDialog({
  open,
  onOpenChange,
  onApply,
  initialFilters,
  availableTypes,
}: FilterDialogProps) {
  const [marketCap, setMarketCap] = useState(initialFilters.marketCap ?? 0);
  const [uniqueHolders, setUniqueHolders] = useState(
    initialFilters.uniqueHolders ?? 0
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialFilters.selectedTypes ?? []
  );
  const [requireSafeScan, setRequireSafeScan] = useState(
    initialFilters.safeScan ?? false
  );

  useEffect(() => {
    if (open) {
      setMarketCap(initialFilters.marketCap ?? 0);
      setUniqueHolders(initialFilters.uniqueHolders ?? 0);
      setSelectedTypes(initialFilters.selectedTypes ?? []);
      setRequireSafeScan(initialFilters.safeScan ?? false);
    }
  }, [initialFilters, open]);

  if (!open) return null;

  const applyFilters = () => {
    onApply({
      marketCap: marketCap > 0 ? marketCap : undefined,
      uniqueHolders: uniqueHolders > 0 ? uniqueHolders : undefined,
      selectedTypes: selectedTypes.length ? selectedTypes : undefined,
      safeScan: requireSafeScan ? true : undefined,
    });
    onOpenChange(false);
  };

  const resetFilters = () => {
    setMarketCap(0);
    setUniqueHolders(0);
    setSelectedTypes([]);
    setRequireSafeScan(false);
    onApply({});
    onOpenChange(false);
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <Card className="w-full max-w-md border border-white/30 bg-white">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">Filters</h3>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full bg-slate-100 p-1 text-slate-500 transition hover:bg-slate-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Minimum Market Cap (USD)
            </label>
            <input
              type="number"
              min={0}
              step={100000}
              value={marketCap}
              onChange={(event) =>
                setMarketCap(Number(event.target.value) || 0)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              placeholder="e.g. 1,000,000"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Minimum Unique Holders
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={uniqueHolders}
              onChange={(event) =>
                setUniqueHolders(Number(event.target.value) || 0)
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              placeholder="e.g. 1,000"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Coin Types
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    selectedTypes.includes(type)
                      ? "border-purple-500 bg-purple-500/10 text-purple-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-purple-200"
                  )}
                >
                  {type}
                </button>
              ))}
              {availableTypes.length === 0 && (
                <span className="text-sm text-slate-500">
                  No type metadata available.
                </span>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={requireSafeScan}
              onChange={(event) => setRequireSafeScan(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-purple-500 focus:ring-purple-400"
            />
            Require SafeScan Verification
          </label>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <Button
              className="bg-slate-200 text-slate-700 hover:bg-slate-300"
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type MemecoinCardProps = {
  coin: Memecoin;
  isExpanded: boolean;
  getCardStyle: () => CSSProperties;
  onMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseUp: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (event: MouseEvent<HTMLDivElement>) => void;
  onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
  onToggleExpanded: () => void;
};

const MemecoinCard = ({
  coin,
  isExpanded,
  getCardStyle,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onToggleExpanded,
}: MemecoinCardProps) => {
  const gradient = getGradientFromColorString(coin.color ?? colorPalette[0]);

  return (
    <Card
      className="absolute inset-0 cursor-grab border-4 border-white shadow-2xl transition-all duration-300 active:cursor-grabbing"
      style={{
        ...getCardStyle(),
        background: gradient,
        cursor: isExpanded ? "default" : "grab",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <CardContent className="flex h-full flex-col p-0 text-white">
        <div
          className={cn(
            isExpanded ? "flex-none" : "flex-1",
            "relative flex items-center justify-center p-8"
          )}
        >
          <div
            className="absolute inset-0 rounded-t-3xl"
            style={{ background: gradient }}
          />
          <img
            src={
              coin.creatorProfile?.avatar?.previewImage?.medium ??
              "/polypuff.svg"
            }
            alt={coin.name}
            width={isExpanded ? 96 : 160}
            height={isExpanded ? 96 : 160}
            className={cn(
              "relative z-10 rounded-full border-8 border-white shadow-2xl transition-all duration-300 object-cover",
              isExpanded ? "h-24 w-24" : "h-40 w-40"
            )}
          />

          <Badge
            className={cn(
              "absolute right-6 top-6 text-lg font-semibold uppercase tracking-tight",
              (coin.marketCapDelta24h ?? 0) > 0
                ? "bg-lime-400 text-black hover:bg-lime-300"
                : "bg-red-500 text-white hover:bg-red-600"
            )}
          >
            {(coin.marketCapDelta24h ?? 0) > 0 ? (
              <>
                <TrendingUpIcon />+
                {Math.floor(Math.abs(coin.marketCapDelta24h ?? 0))}%
              </>
            ) : (
              <>
                <TrendingDownIcon />-
                {Math.floor(Math.abs(coin.marketCapDelta24h ?? 0))}%
              </>
            )}
          </Badge>

          <button
            type="button"
            onClick={onToggleExpanded}
            className="absolute bottom-4 right-4 z-10 rounded-full bg-white/20 p-2 backdrop-blur transition hover:bg-white/30"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-6 w-6 text-white" />
            ) : (
              <ChevronUpIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        <div className="px-4 text-center">
          <h2
            className={cn(
              "font-semibold text-gray-900 transition-all duration-300",
              isExpanded ? "text-2xl" : "truncate text-3xl whitespace-nowrap"
            )}
          >
            {coin.name}
          </h2>
          <p
            className={cn(
              "text-gray-600 transition-all duration-300 font-medium",
              isExpanded ? "text-lg" : "text-xl"
            )}
          >
            ${coin.symbol}
          </p>
        </div>

        <div className={cn("rounded-b-3xl bg-white/95 text-gray-900")}>
          <div
            className={cn(
              isExpanded ? "h-full overflow-y-auto" : "",
              "space-y-4 p-6"
            )}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-100 p-4 text-center">
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Market Cap
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {coin.marketCap}
                </p>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <p className="text-sm uppercase tracking-wide text-purple-400">
                  Holders
                </p>
                <p className="text-2xl font-semibold text-purple-600">
                  {coin.uniqueHolders}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <p className="text-sm uppercase tracking-wide text-blue-600">
                  24h Volume
                </p>
                <p className="text-2xl font-semibold text-blue-900">
                  {coin.volume24h}
                </p>
              </div>
              <div className="rounded-xl bg-yellow-50 p-4 text-center">
                <p className="text-sm uppercase tracking-wide text-yellow-600">
                  Address
                </p>
                {coin.address ? (
                  <a
                    href={`https://basescan.org/address/${coin.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-mono text-yellow-800 underline-offset-4 hover:underline"
                  >
                    {coin.address.slice(0, 6)}...{coin.address.slice(-4)}
                  </a>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>

            <div
              className="flex cursor-pointer items-center gap-2 rounded-xl p-2 transition hover:bg-gray-50"
              style={{ maxWidth: 220 }}
              onClick={() => {
                if (coin.creatorAddress) {
                  window.open(
                    `https://basescan.org/address/${coin.creatorAddress}`,
                    "_blank"
                  );
                }
              }}
            >
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Created by
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {coin.creatorProfile?.handle ?? "Unknown"}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="space-y-6 pt-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Supply:</span>
                      <span>{coin.totalSupply ?? "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date Created:</span>
                      <span>
                        {coin.createdAt
                          ? new Date(coin.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-indigo-50 p-4">
                  <h3 className="text-lg font-semibold text-indigo-900">
                    About {coin.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-indigo-900/80">
                    {coin.description ??
                      "This memecoin is still waiting for its lore to be written."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TrendingUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1 inline-block h-4 w-4"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1 inline-block h-4 w-4"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const ChevronUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ConnectWalletButton = () => (
  <button
    type="button"
    className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
  >
    Connect Wallet
  </button>
);
