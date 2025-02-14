"use client";

import { useEffect, useState, useRef } from "react";
import { fetchUsers } from "@/src/lib/serverActions";
import { fetchRentals } from "@/src/lib/rentals";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChartLine, faMoneyBillTrendUp } from "@fortawesome/free-solid-svg-icons";
import { useDashboardDate } from "@/src/context/DashboardDateContext";
import { ChartData, Rental } from "@/src/types";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function parseDate(dateString?: string) {
  if (!dateString) return new Date();
  const [year, month, day] = dateString.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export default function DashboardPage() {
  const { selectedDate } = useDashboardDate();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [totalRentals, setTotalRentals] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [maxIndicatorWidth, setMaxIndicatorWidth] = useState<number>(0);
  const [indicatorsContainerWidth, setIndicatorsContainerWidth] = useState<number>(0);

  const userIndicatorRef = useRef<HTMLDivElement>(null);
  const creditIndicatorRef = useRef<HTMLDivElement>(null);
  const rentalIndicatorRef = useRef<HTMLDivElement>(null);
  const indicatorsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const users = await fetchUsers();
      setTotalUsers(users.length);

      const rentals: Rental[] = await fetchRentals();
      console.log("Rentals recebidos do Firebase:", rentals);

      const selectedDateObj = parseDate(selectedDate);
      const selectedYear = selectedDateObj.getFullYear();
      const selectedMonth = selectedDateObj.getMonth();

      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const dailySpentData: number[] = new Array(daysInMonth).fill(0);

      let totalSpentToday = 0;
      let rentalCountToday = 0;

      rentals.forEach((rental) => {
        if (!rental.endDate || !rental.price) return;

        let endDateObj: Date | null = null;

        if (typeof rental.endDate === "string") {
          endDateObj = new Date(rental.endDate);
        } else if (typeof rental.endDate === "object") {
          const seconds = rental.endDate.seconds ?? rental.endDate._seconds;
          if (seconds) {
            endDateObj = new Date(seconds * 1000);
          }
        }

        if (!endDateObj || isNaN(endDateObj.getTime())) {
          console.warn("endDate inválido para rental:", rental);
          return;
        }

        if (
          endDateObj.getFullYear() === selectedYear &&
          endDateObj.getMonth() === selectedMonth
        ) {
          const dayIndex = endDateObj.getDate() - 1;
          dailySpentData[dayIndex] += rental.price;
        }

        const rentalDateString = endDateObj.toISOString().split("T")[0];
        if (rentalDateString === selectedDate) {
          totalSpentToday += rental.price;
          rentalCountToday++;
        }
      });

      setTotalCredits(totalSpentToday);
      setTotalRentals(rentalCountToday);

      const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Gastos por Dia (R$)",
            data: dailySpentData,
            borderColor: "#4B68F8",
            backgroundColor: "rgba(75, 104, 248, 0.3)",
            fill: true,
          },
        ],
      });
    }

    loadData();
  }, [selectedDate]);

  useEffect(() => {
    const widths = [
      userIndicatorRef.current?.offsetWidth || 0,
      creditIndicatorRef.current?.offsetWidth || 0,
      rentalIndicatorRef.current?.offsetWidth || 0,
    ];
    setMaxIndicatorWidth(Math.max(...widths));
  }, [totalUsers, totalCredits, totalRentals]);

  useEffect(() => {
    if (indicatorsContainerRef.current) {
      setIndicatorsContainerWidth(indicatorsContainerRef.current.offsetWidth);
    }
  }, [maxIndicatorWidth]);

  return (
    <div className="items-center justify-items-center min-h-screen p-6">
      <main className="flex flex-col justify-center items-center gap-8">
        <div ref={indicatorsContainerRef}>
          <section className="flex flex-row gap-8">
            {/* Indicador: Total de Usuários */}
            <div
              ref={userIndicatorRef}
              className="bg-white shadow-md rounded-lg flex items-center gap-4 px-4 py-2"
              style={maxIndicatorWidth ? { width: maxIndicatorWidth } : {}}
            >
              <FontAwesomeIcon icon={faUser} className="text-blue-900 text-3xl" />
              <div className="flex flex-col items-start">
                <p className="whitespace-nowrap text-gray-500 text-sm">Total de Usuários</p>
                <p className="whitespace-nowrap text-lg font-bold">{totalUsers}</p>
              </div>
            </div>

            {/* Indicador: Lucro ao Dia */}
            <div
              ref={creditIndicatorRef}
              className="bg-white shadow-md rounded-lg flex items-center gap-4 px-4 py-2"
              style={maxIndicatorWidth ? { width: maxIndicatorWidth } : {}}
            >
              <FontAwesomeIcon icon={faMoneyBillTrendUp} className="text-blue-900 text-3xl" />
              <div className="flex flex-col items-start">
                <p className="whitespace-nowrap text-gray-500 text-sm">Lucro de Créditos do Dia</p>
                <p className="whitespace-nowrap text-lg font-bold">
                  R$ {totalCredits.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Indicador: Número de Aluguéis do Dia */}
            <div
              ref={rentalIndicatorRef}
              className="bg-white shadow-md rounded-lg flex items-center gap-4 px-4 py-2"
              style={maxIndicatorWidth ? { width: maxIndicatorWidth } : {}}
            >
              <FontAwesomeIcon icon={faChartLine} className="text-blue-900 text-3xl" />
              <div className="flex flex-col items-start">
                <p className="whitespace-nowrap text-gray-500 text-sm">Aluguéis do Dia</p>
                <p className="whitespace-nowrap text-lg font-bold">{totalRentals}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Gráfico de Lucros mensais */}
        <div
          className="bg-white shadow-md rounded-lg p-6"
          style={indicatorsContainerWidth ? { width: indicatorsContainerWidth } : {}}
        >
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Lucros mensais -{" "}
            {parseDate(selectedDate).toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          {chartData ? <Line data={chartData} /> : <p>Carregando gráfico...</p>}
        </div>
      </main>
    </div>
  );
}
