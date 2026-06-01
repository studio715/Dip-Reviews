import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { reviewTemplates } from "./db";
import "./Reviews.css";

export default function Reviews() {

  const GOOGLE_REVIEW_LINK =
    "https://g.page/r/CbDe8MCm-KgWEAE/review";

    const categories = [
        {
          key: "residential",
          label: "Residential",
          icon: (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1H15v-5H9v5H4a1 1 0 0 1-1-1V10.5z" />
            </svg>
          ),
        },
      
        {
          key: "commercial",
          label: "Commercial",
          icon: (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
            </svg>
          ),
        },
      
        {
          key: "industrial",
          label: "Industrial",
          icon: (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 21V9l7 4V9l11 6v6H3z" />
              <path d="M7 21v-4" />
              <path d="M12 21v-3" />
              <path d="M17 21v-2" />
            </svg>
          ),
        },
      
        {
          key: "employer",
          label: "Employer",
          icon: (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            </svg>
          ),
        },
      
        {
          key: "employee",
          label: "Employee",
          icon: (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M8 21v-4h8v4" />
              <path d="M5.5 17a6.5 6.5 0 0 1 13 0" />
            </svg>
          ),
        },
      
        {
          key: "general",
          label: "General",
          icon: (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          ),
        },
      ];

  const getRandomReview = (category) => {
    const reviews = reviewTemplates[category];

    return reviews[
      Math.floor(Math.random() * reviews.length)
    ];
  };

  const [category, setCategory] =
    useState("residential");

  const [reviewText, setReviewText] =
    useState(
      getRandomReview("residential")
    );

  const [copied, setCopied] =
    useState(false);

  const changeCategory = (newCategory) => {

    setCategory(newCategory);

    setReviewText(
      getRandomReview(newCategory)
    );

    setCopied(false);
  };

  const nextReview = () => {

    const reviews =
      reviewTemplates[category];

    const currentIndex =
      reviews.indexOf(reviewText);

    const nextIndex =
      currentIndex === reviews.length - 1
        ? 0
        : currentIndex + 1;

    setReviewText(
      reviews[nextIndex]
    );

    setCopied(false);
  };

  const prevReview = () => {

    const reviews =
      reviewTemplates[category];

    const currentIndex =
      reviews.indexOf(reviewText);

    const prevIndex =
      currentIndex <= 0
        ? reviews.length - 1
        : currentIndex - 1;

    setReviewText(
      reviews[prevIndex]
    );

    setCopied(false);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextReview,
    onSwipedRight: prevReview,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const copyReview = async () => {

    if (!reviewText.trim()) {
      alert("Please write a review.");
      return;
    }

    try {

      await navigator.clipboard.writeText(
        reviewText
      );

      setCopied(true);

      setTimeout(() => {
        window.location.href =
          GOOGLE_REVIEW_LINK;
      }, 400);

    } catch (error) {

      alert(
        "Unable to copy review."
      );
    }
  };

  const clearReview = () => {

    setReviewText("");

    setCopied(false);
  };

  return (
    <section className="reviews-page">

      <div className="reviews-card">

        <div className="reviews-header">

          <div className="reviews-badge">
            Google Reviews
          </div>

          <h1>
            Share Your Experience
          </h1>

          <p>
            Use a sample review, edit it,
            or write your own review
            before posting it on Google.
          </p>

        </div>

        <div className="review-categories">

          {categories.map((item) => (

            <button
            key={item.key}
            className={
            category === item.key
                ? "active"
                : ""
            }
            onClick={() =>
            changeCategory(item.key)
            }
            >
            <span className="category-icon">
            {item.icon}
            </span>

            {item.label}
            </button>

          ))}

        </div>

        <div className="review-navigation">

          <button
            className="review-nav-btn"
            onClick={prevReview}
          >
            ‹
          </button>

          <div className="review-counter">
            Try Another Review
          </div>

          <button
            className="review-nav-btn"
            onClick={nextReview}
          >
            ›
          </button>

        </div>

        <div className="editor-header">

          <div className="editor-title">
            Review Draft
          </div>

          <button
            className="clear-btn"
            onClick={clearReview}
          >
            ✕ Clear
          </button>

        </div>

        <div {...handlers}>

          <textarea
            value={reviewText}
            onChange={(e) =>
              setReviewText(
                e.target.value
              )
            }
            placeholder="Write your review here..."
          />

        </div>

        <div className="character-count">
          {reviewText.length} characters
        </div>

        <button
          className="submit-btn"
          onClick={copyReview}
        >
          Copy Review & Open Google
        </button>

        {copied && (

          <div className="review-success">

            ✓ Review copied successfully.
            Opening Google Reviews...

          </div>

        )}

      </div>

    </section>
  );
}