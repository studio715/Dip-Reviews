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
      icon: "🏠",
    },
    {
      key: "commercial",
      label: "Commercial",
      icon: "🏢",
    },
    {
      key: "industrial",
      label: "Industrial",
      icon: "🏭",
    },
    {
      key: "employer",
      label: "Employer",
      icon: "👨‍💼",
    },
    {
      key: "employee",
      label: "Employee",
      icon: "👷",
    },
    {
      key: "general",
      label: "General",
      icon: "⭐",
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
              <span>
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