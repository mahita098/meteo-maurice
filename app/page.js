"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [weather, setWeather] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then(({ lastUpdated, data }) => {
        setWeather(data); // Store weather data
        setLastUpdated(lastUpdated); // Store the last updated timestamp
      })
      .catch((err) => console.error("Error fetching weather:", err));
  }, []);

  if (!weather.length) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <main>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl p-7 font-extrabold">
            Mauritius Weather Forecast
          </h1>

          {lastUpdated && (
            <p className="text-sm text-gray-500 ">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <ul className="grid md:grid-cols-1 gap-2 items-center justify-center">
          {weather.map((day, index) => (
            <li
              key={index}
              className="bg-gray-100 w-full rounded-4xl p-8 pt-4 grid grid-flow-col gap-5"
            >
              <div className="flex flex-col items-center">
                <h2>{day.day}</h2>
                <p>{day.date.replace(/\(|\)/g, "")}</p>
              </div>
              <div className="flex flex-col items-center">
                <p>Condition: </p>
                <p>{day.condition}</p>
              </div>
              <div className="flex flex-col items-center">
                <p>Temperature:</p>
                <p>
                  {day.min} - {day.max}
                </p>
                {parseInt(day.max) > 26 ? (
                  <img
                    src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWJkMmE5NjNuc2FkbG1uYnRrM3hlY2sxY2lkZGxidWJhNmYzeTk3MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ify8LioiUw91qBxyu1/giphy.gif"
                    alt="Hot weather"
                    className="w-[150px] h-[100px] rounded-2xl" // Adjust the size as needed
                  />
                ) : parseInt(day.min) >= 20 && parseInt(day.max) <= 26 ? (
                  <img
                    src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXdjZ3dzNG56YWFwc2lkODJpNXgzcG03NHZqd3hoaDhxM2F5MGpqNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/loUqCMSfXHcsVb3cUZ/giphy.gif"
                    alt="Mild weather"
                    className="w-24 h-24 rounded-2xl" // Adjust the size as needed
                  />
                ) : parseInt(day.min) < 20 && parseInt(day.max) < 23 ? (
                  <img
                    src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjV2YWdwd29mYzhxdXg1aTE4NnZyaTZxa3k0dXU1cXRwNThpaGF5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BZcx8aFlIlLwDfMUqv/giphy.gif"
                    alt="Cold weather"
                    className="w-[150px] h-[100px] rounded-2xl" // Adjust the size as needed
                  />
                ) : null}
              </div>

              <div className="flex flex-col items-center">
                <p>Wind: </p>
                <p>{day.wind}</p>
              </div>

              <div className="flex flex-col items-center">
                <p>Sea Condition: </p>
                <p>{day["sea condition"]}</p>
                {day["sea condition"] === "moderate" && (
                  <img
                    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGpucmFuNnVnMm04NXlleXc2Z3ZieDV3dGJpenJiajhuc3Y2cDJjYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjHZMFYibQnjvTq0/giphy.gif"
                    alt="Moderate Sea Condition"
                    className="w-[200px] h-[100px] rounded-2xl"
                  />
                )}
                {day["sea condition"] === "rough" && (
                  <img
                    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHBuOTA4MDY4OTYzdWJpdnVkcTZwNWdrajFjbm1ob3B2NzFjcGJ3bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUOxeUqZbV4vSPBXt6/giphy.gif"
                    alt="Moderate Sea Condition"
                    className="w-[200px] h-[100px] rounded-2xl"
                  />
                )}
              </div>

              <div className="flex flex-col items-center">
                <p>Probability: </p>
                <p>{day.probability}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
