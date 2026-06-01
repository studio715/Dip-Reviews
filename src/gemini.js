export async function generateReview(category) {
    const res = await fetch("/api/generate-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });
  
    if (!res.ok) throw new Error("Failed to generate review");
  
    const data = await res.json();
    return data.review;
  }