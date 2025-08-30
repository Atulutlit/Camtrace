import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {IP_FETCH} from './../constant/contant'

// Dummy data for now
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
  const id = searchParams.get("id"); // ✅ get id from query params

  useEffect(() => {
    async function fetchIpAddress() {
      try {
        // API call with id in params
        const res = await fetch(
          `${IP_FETCH}?id=${id}`,
          {
            method: "POST", // ✅ method should be inside an options object
            headers: {
              "Content-Type": "application/json",
            },
            // If your API expects body too, pass it here
            // body: JSON.stringify({ otherData: "value" }),
          }
        );
        const data = await res.json();
        console.log("Fetched Response:", data);

        // Example: if backend sends news, update state
        // setNews(data.news);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchIpAddress();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Latest News</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-sm text-blue-600 font-medium mb-1">
              {item.category} • {item.date}
            </p>
            <p className="text-gray-700 mb-3">{item.description}</p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
