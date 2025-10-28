import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IP_FETCH } from "./../constant/contant";
import './../css/NewsFeed.css'
const dummyNews = [
  {
    id: 1,
    title: "Government Announces New Policy",
    category: "Politics",
    description:
      "The government has introduced a new policy aimed at improving rural development.",
    date: "2025-08-30",
  },
  {
    id: 2,
    title: "Tech Giants Release AI Tools",
    category: "Technology",
    description:
      "Major tech companies unveil powerful AI tools to revolutionize industries.",
    date: "2025-08-29",
  },
  {
    id: 3,
    title: "Local Team Wins Championship",
    category: "Sports",
    description:
      "The underdogs secured a thrilling victory in the finals last night.",
    date: "2025-08-28",
  },
];

export default function NewsFeed() {
  const [news, setNews] = useState(dummyNews);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    async function fetchIpAddress() {
      try {
        const res = await fetch(`${IP_FETCH}?id=${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        console.log("Fetched Response:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchIpAddress();
  }, []);

  return (
    <div className="news-container">
      <h1 className="news-heading">Latest News</h1>

      <div className="news-grid">
        {news.map((item) => (
          <div key={item.id} className="news-card">
            <h2 className="news-title">{item.title}</h2>
            <p className="news-category">
              {item.category} • {item.date}
            </p>
            <p className="news-desc">{item.description}</p>
            <button className="read-btn">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
}
