import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addReview, getReviews } from "@/services/reviewService";
import { Review } from "@/services/types";
import { Star } from "lucide-react";

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>(() => getReviews());
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [reviews]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const review = addReview({
      author: author.trim(),
      rating,
      comment: comment.trim(),
    });

    setReviews((current) => [review, ...current]);
    setAuthor("");
    setRating(5);
    setComment("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container grid gap-8 py-10 lg:grid-cols-[360px_1fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <h1 className="font-display text-3xl font-semibold text-foreground">Opinie</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Srednia ocena: {average.toFixed(1)} / 5 z {reviews.length} opinii.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground" htmlFor="author">Imie</label>
              <Input id="author" value={author} onChange={(event) => setAuthor(event.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground" htmlFor="rating">Ocena</label>
              <select
                id="rating"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground" htmlFor="comment">Opinia</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <Button type="submit" className="w-full">Dodaj opinie</Button>
          </form>
        </section>

        <section className="space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-medium text-foreground">{review.author}</h2>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(new Date(review.createdAt))}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">{review.comment}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Reviews;
