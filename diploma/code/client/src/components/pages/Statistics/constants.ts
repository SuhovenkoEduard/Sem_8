import { DailyLogData } from "firestore/converters";

export type DailyLogdataKey = keyof Omit<
  DailyLogData,
  "createdAt" | "takenMedications" | "notes" | "carbohydratesIntake"
>;

export const chartLabels: {
  [key in DailyLogdataKey]: string;
} = {
  weight: "Вес",
  sugarLevel: "Уровень сахара",
  pulse: "Пульс",
  systolic: "Систолическое давление",
  diastolic: "Диастолическое давление",
  total: "Колиество каллорий",
  temperature: "Температура",
};

export const chartsInfo = Object.entries(chartLabels).map(([key, value]) => ({
  propName: key as DailyLogdataKey,
  title: value,
}));

export const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "",
    },
  },
  maintainAspectRatio: false,
};
