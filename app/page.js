"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const getWeatherIcon = (condition) => {
  const conditionLower = condition.toLowerCase(); // Normalize to lowercase

  // Check for morning rain
  if (conditionLower.includes("morning showers")) {
    return "/morningrain.gif";
  }

  // Check for scattered or passing showers
  if (
    conditionLower.includes("showers") ||
    conditionLower.includes("partly cloudy")
  ) {
    return "/partlycloudy.gif";
  }

  // Check for night rain
  if (conditionLower.includes("night showers")) {
    return "/rainingnight.gif";
  }

  // Check for fair or sunny conditions
  if (
    conditionLower.includes("fair") ||
    conditionLower.includes("clear sky") ||
    conditionLower.includes("fine")
  ) {
    return "/sunny.gif";
  }

  // Default icon
  return "/default.svg";
};

export default function Home() {
  const [weather, setWeather] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then(({ lastUpdated, data }) => {
        const today = new Date();
        const todayDay = today.toLocaleString("en-US", { weekday: "long" });
        const todayMonth = today.toLocaleString("en-US", { month: "short" });
        const todayDate = today.getDate();

        // Filter out past days and only keep today and future days
        const filteredWeather = data.filter((day) => {
          const dayDate = day.date.replace(/\s+/g, " ").trim();
          return (
            (day.day === todayDay && dayDate >= `${todayMonth} ${todayDate}`) ||
            dayDate > `${todayMonth} ${todayDate}`
          );
        });

        // Move today's forecast to the top
        const todayIndex = filteredWeather.findIndex((day) => {
          const dayDate = day.date.replace(/\s+/g, " ").trim();
          return (
            day.day === todayDay && dayDate === `${todayMonth} ${todayDate}`
          );
        });

        if (todayIndex !== -1) {
          const sortedWeather = [
            filteredWeather[todayIndex],
            ...filteredWeather.slice(0, todayIndex),
            ...filteredWeather.slice(todayIndex + 1),
          ];
          setWeather(sortedWeather);
        } else {
          setWeather(filteredWeather); // Fallback if today is missing
        }

        setLastUpdated(lastUpdated);
      })
      .catch((err) => console.error("Error fetching weather:", err));
  }, []);

  if (!weather.length) return <div>Loading...</div>;

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-200">
      <div className="container mx-auto max-w-5xl px-4">
        <main>
          <div className="flex flex-col md:flex-row items-center justify-between ">
            <h1 className="text-3xl px-4 pt-6 pb-2 md:p-7 font-extrabold w-full">
              Mauritius Weather Forecast
            </h1>
            {lastUpdated && (
              <p className="text-sm text-gray-500 p-4 md:p-0 text-left md:text-right w-full">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>

          <ul className="grid md:grid-cols-1 gap-2 items-center justify-center">
            {weather.map((day, index) => (
              <li
                key={index}
                className="bg-slate-100/50 w-full rounded-4xl p-8 pt-4 md:grid md:grid-flow-col md:gap-5 flex flex-col gap-3.5 cursor-pointer"
                onClick={() =>
                  setExpandedDay(expandedDay === index ? null : index)
                }
              >
                <div className="flex  md:flex-col items-center md:text-left w-full">
                  <h2>{day.day}</h2>
                  <p className="text-lg font-bold">
                    {day.date.replace(/\(|\)/g, "")}
                  </p>
                </div>

                {expandedDay === index || index === 0 ? (
                  <>
                    <div className="flex md:flex-col items-center gap-4">
                      <p>Condition:</p>
                      <p className="text-lg font-bold">{day.condition}</p>
                      <img src={getWeatherIcon(day.condition)} alt="Weather" />
                    </div>

                    <div className="flex items-center md:flex-col gap-4">
                      <p>Temperature:</p>
                      <p className="text-lg font-bold">
                        {day.min} - {day.max}°C
                      </p>
                      {parseInt(day.max) > 26 ? (
                        <img
                          src="/tempover30.gif"
                          alt="Hot weather"
                          className="w-[100px] rounded-2xl mt-3"
                        />
                      ) : parseInt(day.min) >= 20 && parseInt(day.max) <= 26 ? (
                        <img
                          src="/good.gif"
                          alt="mild weather"
                          className="w-[150px] rounded-2xl mt-3"
                        />
                      ) : parseInt(day.min) < 20 && parseInt(day.max) < 23 ? (
                        <img
                          src="/coldemoji.gif"
                          alt="Cold weather"
                          className="w-[150px] rounded-2xl mt-3"
                        />
                      ) : null}
                    </div>

                    <div className="flex items-center md:flex-col gap-4">
                      <p>Wind:</p>
                      <p className="text-lg font-bold">{day.wind}</p>
                    </div>

                    <div className="flex items-center md:flex-col gap-4">
                      <p>Sea Condition:</p>
                      <p className="text-lg font-bold">
                        {day["sea condition"]}
                      </p>
                      {day["sea condition"] === "moderate" && (
                        <img
                          src="/moderatesea.gif"
                          alt="Moderate Sea"
                          className="w-[100px] rounded-4xl"
                        />
                      )}
                      {day["sea condition"] === "rough" && (
                        <img
                          src="/roughwave.gif"
                          alt="Moderate Sea"
                          className="rounded-4xl"
                        />
                      )}
                    </div>

                    <div className="flex items-center  md:flex-col gap-4">
                      <p>Probability:</p>
                      <p className="text-lg font-bold">{day.probability}</p>
                    </div>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
