"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    <div className="bg-gradient-to-r from-green-50 to-blue-200">
      <div className="container mx-auto max-w-5xl px-4 ">
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
                className="bg-blue-100/50 bg-opacity-5 w-full rounded-4xl p-8 pt-4 md:grid 
                 md:grid-flow-col md:gap-5"
              >
                <div className="flex flex-row md:flex-col md:items-center justify-between  gap-6 ">
                  <h2 className="text-lg font-bold">{day.day}</h2>
                  <div className="flex flex-col items-center  ">
                    <p>{day.date.replace(/\(|\)/g, "")}</p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col md:items-center justify-between gap-6 ">
                  <p className="text-lg font-bold">Condition: </p>
                  <div className="flex flex-col items-center  ">
                    <p>{day.condition}</p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:justify-evenly gap-6 ">
                  <p className="text-lg font-bold">Temperature:</p>
                  <div className="flex flex-col items-center ">
                    <p>
                      {day.min} - {day.max}
                    </p>
                    {parseInt(day.max) > 26 ? (
                      <img
                        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWJkMmE5NjNuc2FkbG1uYnRrM3hlY2sxY2lkZGxidWJhNmYzeTk3MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ify8LioiUw91qBxyu1/giphy.gif"
                        alt="Hot weather"
                        className="w-[150px] h-[100px] rounded-2xl mt-3" // Adjust the size as needed
                      />
                    ) : parseInt(day.min) >= 20 && parseInt(day.max) <= 26 ? (
                      <Image
                        src="/sunny.svg"
                        alt="Moderate Sea Condition"
                        width={90}
                        height={90}
                        className="rounded-4xl mt-3"
                      />
                    ) : parseInt(day.min) < 20 && parseInt(day.max) < 23 ? (
                      <img
                        src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjV2YWdwd29mYzhxdXg1aTE4NnZyaTZxa3k0dXU1cXRwNThpaGF5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BZcx8aFlIlLwDfMUqv/giphy.gif"
                        alt="Cold weather"
                        className="w-[150px] h-[100px] rounded-2xl mt-3" // Adjust the size as needed
                      />
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col md:items-center justify-between  gap-6 ">
                  <p className="text-lg font-bold">Wind: </p>
                  <div className="flex flex-col items-center  ">
                    <p>{day.wind}</p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col md:items-center justify-between  gap-6 ">
                  <p className="text-lg font-bold">Sea Condition: </p>
                  <div className="flex flex-col items-center h-full justify-between ">
                    <p>{day["sea condition"]}</p>
                    {day["sea condition"] === "moderate" && (
                      <Image
                        src="/moderatewaves.svg"
                        alt="Moderate Sea Condition"
                        width={200}
                        height={100}
                        className="rounded-4xl"
                      />
                    )}
                    {day["sea condition"] === "rough" && (
                      <Image
                        src="/roughwaves.svg"
                        alt="Moderate Sea Condition"
                        width={200}
                        height={100}
                        className="rounded-4xl"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col md:items-center justify-between  gap-6 ">
                  <p className="text-lg font-bold">Probability: </p>
                  <div className="flex flex-col items-center  ">
                    {" "}
                    <p>{day.probability}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
