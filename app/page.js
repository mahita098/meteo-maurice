"use client";
import { useEffect, useState } from "react";

const getWeatherIcon = (condition) => {
  const conditionLower = condition.toLowerCase(); // Normalize to lowercase

  // Check for morning rain
  if (
    conditionLower.includes("morning showers") ||
    conditionLower.includes("morning localised showers")
  ) {
    return "/morningrain.gif";
  }

  // Check for scattered or passing showers
  if (
    conditionLower.includes("partly cloudy") ||
    conditionLower.includes("few showers")
  ) {
    return "/partlycloudy.gif";
  }

  if (conditionLower.includes("intermittent")) {
    return "/intermittenrainfall.gif";
  }

  if (
    conditionLower.includes("thunderstorms") ||
    conditionLower.includes("scattered")
  ) {
    return "/thunderstorm.gif";
  }

  // Check for night rain
  if (
    conditionLower.includes("night showers") ||
    conditionLower.includes("afternoon showers") ||
    conditionLower.includes("afternoon localised showers")
  ) {
    return "/rainynight.gif";
  }

  if (
    conditionLower.includes("fair") ||
    conditionLower.includes("clear sky") ||
    conditionLower.includes("fine")
  ) {
    return "/sunny.gif";
  }

  return "/default.svg";
};

export default function Home() {
  const [weather, setWeather] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then(({ lastUpdated, data }) => {
        const today = new Date();
        const todayDay = today.toLocaleString("en-US", { weekday: "long" });
        const todayMonth = today.toLocaleString("en-US", { month: "short" });
        const todayDate = today.getDate();

        // console.log(
        //   "Raw Weather Data:",
        //   data.map((day) => day.date)
        // );

        const filteredWeather = data.filter((day) => {
          const dayDate = day.date.replace(/\s+/g, " ").trim();
          return (
            dayDate === `${todayMonth} ${todayDate}` ||
            dayDate > `${todayMonth} ${todayDate}`
          );
        });

        // console.log("Filtered Weather:", filteredWeather);

        const todayIndex = filteredWeather.findIndex((day) => {
          const dayDate = day.date.replace(/\s+/g, " ").trim();

          return (
            day.day === todayDay && dayDate === `${todayMonth} ${todayDate}`
          );
        });

        // console.log("Today Index:", todayIndex);

        if (todayIndex !== -1) {
          const sortedWeather = [
            filteredWeather[todayIndex],
            ...filteredWeather.slice(0, todayIndex),
            ...filteredWeather.slice(todayIndex + 1),
          ];
          setWeather(sortedWeather);
        } else {
          setWeather(filteredWeather);
        }

        setLastUpdated(lastUpdated);
      })
      .catch((err) => console.error("Error fetching weather:", err));
  }, []);

  if (!weather.length)
    return (
      <div className="bg-gradient-to-r from-[#FDBB2D] to-[#3A1C71] min-h-screen flex justify-center items-center flex-col">
        <p className="font-bold text-center text-2xl">Loading data...</p>
        <img src="/clouds.gif" alt="Weather" className="w-[100px]" />
      </div>
    );

  return (
    <div className="bg-gradient-to-r from-[#FDBB2D] to-[#3A1C71] w-full h-full ">
      <div className="container mx-auto max-w-5xl px-4">
        <main className="w-full h-full">
          <div className="flex flex-col md:flex-row items-center justify-between ">
            <h1 className="text-3xl px-4 pt-6 pb-2 md:p-7 font-extrabold w-full">
              Mauritius Weather Forecast - Weekly
            </h1>
            {lastUpdated && (
              <p className="text-sm text-gray-200 p-4 md:p-0 text-left md:text-right w-full">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>

          <ul className="grid md:grid-cols-1 gap-4 items-center justify-center">
            {weather.map((day, index) => (
              <li
                key={index}
                className="bg-slate-100/50 w-full rounded-2xl px-8 md:p-4 p-4 pb-6 md:grid md:grid-flow-col gap-1  md:gap-5 flex flex-col  cursor-pointer transition-all duration-300 ease-in-out"
              >
                <div className="flex  flex-col md:items-center  md:justify-evenly text-left md:w-full h-fit jusify-center md:self-center py-2 md:py-4">
                  <h2 className="font-bold">{day.day}</h2>
                  <p className="text-2xl font-bold">
                    {day.date.replace(/\(|\)/g, "")}
                  </p>
                </div>

                <>
                  <div className="md:flex md:flex-col items-center gap-4 grid grid-cols-3">
                    <p>Condition:</p>
                    <p className="text-lg break-words md:max-w-56  font-bold leading-5">
                      {day.condition}
                    </p>
                    <img
                      src={getWeatherIcon(day.condition)}
                      alt="Weather"
                      className="max-w-[110px]"
                    />
                  </div>

                  <div className="md:flex items-center md:flex-col gap-4 grid grid-cols-3">
                    <p>Temperature:</p>
                    <p className="text-lg font-bold">
                      {day.min} - {day.max}°C
                    </p>
                    {parseInt(day.max) > 26 ? (
                      <img
                        src="/tempover30.gif"
                        alt="Hot weather"
                        className="w-[90px] rounded-2xl mt-3"
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

                  <div className="md:flex items-center md:flex-col gap-4 grid grid-cols-3">
                    <p>Wind:</p>
                    <p className="text-lg font-bold">{day.wind}</p>
                    <div></div>
                  </div>

                  <div className="md:flex items-center md:flex-col gap-4 grid grid-cols-3">
                    <p>Sea Condition:</p>
                    <p className="text-lg font-bold">{day["sea condition"]}</p>
                    {day["sea condition"] === "moderate" && (
                      <img
                        src="/moderate.gif"
                        alt="Moderate Sea"
                        className="w-[100px] pt-5  rounded-4xl"
                      />
                    )}
                    {day["sea condition"] === "rough" && (
                      <img
                        src="/roughwave.gif"
                        alt="rough Sea"
                        className="rounded-4xl w-[90px] pt-5 "
                      />
                    )}
                  </div>

                  <div className="md:flex items-center  md:flex-col gap-4 grid grid-cols-3">
                    <p>Probability:</p>
                    <p className="text-lg font-bold">{day.probability}</p>
                    <div></div>
                  </div>
                </>
              </li>
            ))}
          </ul>
        </main>
        <footer className=" w-full h-full pb-4 mt-8 md:pt-4 ">
          <div className="justify-evenly md:justify-between flex gap-1">
            <div className="hidden md:block"></div>
            <div className="justify-center items-center  flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="pencil"
                viewBox="0 0 128 128"
                width="15px"
              >
                <path
                  fill="#444b54"
                  d="M124.5 127.4H44.1c-1.7 0-3-1.3-3-3s1.3-3 3-3h80.4c1.7 0 3 1.3 3 3S126.2 127.4 124.5 127.4zM24.1 127.4h-20c-1.7 0-3-1.3-3-3s1.3-3 3-3h20c1.7 0 3 1.3 3 3S25.8 127.4 24.1 127.4z"
                ></path>
                <path
                  fill="#aeb3b7"
                  d="M90.1,8.4c5.9-5.9,15.4-5.9,21.2,0l0,0c5.9,5.9,5.9,15.4,0,21.2l-70.7,70.7l-24.7,3.5l3.5-24.7L90.1,8.4z"
                ></path>
                <path
                  fill="#fff"
                  d="M90.1,8.4c5.9-5.9,15.4-5.9,21.2,0l0,0c5.9,5.9,5.9,15.4,0,21.2l-70.7,70.7v0c0-11.7-9.5-21.2-21.2-21.2h0L90.1,8.4z"
                ></path>
                <path
                  fill="#efde97"
                  d="M80.2,18.3c13.1,3.8,19.9,13.4,21.2,21.2l9.9-9.9c5.9-5.9,5.9-15.4,0-21.2l0,0c-5.9-5.9-15.4-5.9-21.2,0C90.1,8.4,80.2,18.3,80.2,18.3z"
                ></path>
                <path
                  fill="#b5a809"
                  d="M97.3,35.1c-1.2-1.2-1.2-3.1,0-4.2l7.6-7.6c1.4-1.4,2-3.4,1.6-5.4c-0.3-1.6,0.8-3.2,2.4-3.5c1.6-0.3,3.2,0.7,3.5,2.4c0.8,3.9-0.5,8-3.3,10.8l-7.6,7.6C100.4,36.3,98.5,36.3,97.3,35.1z"
                ></path>
                <path
                  fill="#aeb3b7"
                  d="M37.8,94.7c-1.2-1.2-1.2-3.1,0-4.2l41-41c1.2-1.2,3.1-1.2,4.2,0c1.2,1.2,1.2,3.1,0,4.2l-41,41C40.8,95.8,38.9,95.8,37.8,94.7z"
                ></path>
                <path
                  fill="#444b54"
                  d="M118.7,19c0-4.8-1.9-9.3-5.3-12.7C110,2.9,105.5,1,100.7,1S91.4,2.9,88,6.3c-1.2,1.2-1.2,3.1,0,4.2c1.2,1.2,3.1,1.2,4.2,0c2.3-2.3,5.3-3.5,8.5-3.5s6.2,1.2,8.5,3.5c2.3,2.3,3.5,5.3,3.5,8.5s-1.2,6.2-3.5,8.5l-6.3,6.3c-3-7.2-9.8-14.9-21.8-18.4c-1.1-0.3-2.2,0-2.9,0.7c0,0-60.9,60.9-60.9,60.9c-0.5,0.5-0.8,1.1-0.8,1.7L13,102.4l-2.8,2.8c-1.2,1.2-1.2,3.1,0,4.2c0.6,0.6,1.4,0.9,2.1,0.9s1.5-0.3,2.1-0.9l2.8-2.8l23.8-3.4c0.6-0.1,1.2-0.4,1.7-0.8l70.7-70.7C116.8,28.3,118.7,23.8,118.7,19z M22,82c7.5,2.4,13.4,8.2,15.7,15.7l-18.3,2.6L22,82z M42.7,93.9c-3-7.8-9.2-13.9-17-17L81,21.7c10.3,3.6,15.6,10.9,17.1,16.8L42.7,93.9z"
                ></path>
              </svg>

              <p className="ml-2">Made by Mahita</p>
            </div>
            <div className="justify-center items-center flex gap-1">
              Data Source{" "}
              <a
                href="https://github.com/MrSunshyne/mauritius-dataset-meteo/"
                target="_blank"
              >
                <svg
                  className="md:w-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M11.999 1C5.926 1 1 5.925 1 12c0 4.86 3.152 8.983 7.523 10.437c.55.102.75-.238.75-.53c0-.26-.009-.952-.014-1.87c-3.06.664-3.706-1.475-3.706-1.475c-.5-1.27-1.221-1.61-1.221-1.61c-.999-.681.075-.668.075-.668c1.105.078 1.685 1.134 1.685 1.134c.981 1.68 2.575 1.195 3.202.914c.1-.71.384-1.195.698-1.47c-2.442-.278-5.01-1.222-5.01-5.437c0-1.2.428-2.183 1.132-2.952c-.114-.278-.491-1.397.108-2.91c0 0 .923-.297 3.025 1.127A10.5 10.5 0 0 1 12 6.32a10.5 10.5 0 0 1 2.754.37c2.1-1.424 3.022-1.128 3.022-1.128c.6 1.514.223 2.633.11 2.911c.705.769 1.13 1.751 1.13 2.952c0 4.226-2.572 5.156-5.022 5.428c.395.34.747 1.01.747 2.037c0 1.47-.014 2.657-.014 3.017c0 .295.199.637.756.53C19.851 20.979 23 16.859 23 12c0-6.075-4.926-11-11.001-11"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
