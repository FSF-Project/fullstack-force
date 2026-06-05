import { Review } from "./types";

const REVIEWS_KEY = "reviews";

const SEED_REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Anna",
    rating: 5,
    comment: "Szybka obsluga i wygodny katalog ksiazek.",
    createdAt: new Date("2026-05-20T10:00:00").toISOString(),
  },
  {
    id: "rev-2",
    author: "Marek",
    rating: 4,
    comment: "Latwo znalezc ksiazke, a koszyk jest przejrzysty.",
    createdAt: new Date("2026-05-22T12:30:00").toISOString(),
  },
];

function readReviews(): Review[] {
  const raw = localStorage.getItem(REVIEWS_KEY);
  if (!raw) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
  }

  return JSON.parse(raw);
}

function saveReviews(reviews: Review[]): void {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function getReviews(): Review[] {
  return readReviews().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addReview(review: Omit<Review, "id" | "createdAt">): Review {
  const newReview: Review = {
    id: "rev-" + Date.now(),
    createdAt: new Date().toISOString(),
    ...review,
  };

  saveReviews([newReview, ...readReviews()]);
  return newReview;
}
