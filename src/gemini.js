export async function generateReview(category) {
    const res = await fetch("/api/generate-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });
  
    const data = await res.json();
    console.log("API Response:", data); // ← add this
  
    if (!res.ok) throw new Error("Failed to generate review");
    return data.review;
  }