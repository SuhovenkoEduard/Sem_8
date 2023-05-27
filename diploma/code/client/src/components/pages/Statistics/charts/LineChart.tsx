import React, { useMemo } from "react";
import { ResizableBox } from "components/ui/ResizableBox";
import { DailyLogData } from "firestore/converters";
import { isMobile } from "react-device-detect";
import {
  DailyLogdataKey,
  lineChartOptions,
} from "components/pages/Statistics/constants";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  // @ts-ignore
  CategoryScale,
  LinearScale,
  // @ts-ignore
  PointElement,
  // @ts-ignore
  LineElement,
  // @ts-ignore
  Title,
  Tooltip,
  // @ts-ignore
  Legend,
} from "chart.js";
import dayjs from "dayjs";

// @ts-ignore
ChartJS.register(
  CategoryScale,
  // @ts-ignore
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = ({
  dailyLogsData,
  propName,
  title,
}: {
  dailyLogsData: DailyLogData[];
  propName: DailyLogdataKey;
  title: string;
}) => {
  const data = useMemo(() => {
    const filteredDailyLogs = dailyLogsData.filter(
      (dailyLogData) => +dailyLogData[propName]
    );
    const mappedDailyLogs = filteredDailyLogs.map((dailyLogData) => ({
      label: dayjs(dailyLogData.createdAt).format("DD MMMM YYYY"),
      data: dailyLogData[propName],
    }));
    return {
      labels: mappedDailyLogs.map(({ label }) => label),
      datasets: [
        {
          label: title,
          data: mappedDailyLogs.map(({ data }) => data),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
  }, [dailyLogsData, propName, title]);

  const boxSize = isMobile
    ? {
        width: 300,
        height: 400,
      }
    : {
        width: 600,
      };

  return (
    <ResizableBox {...boxSize}>
      <Line data={data} options={lineChartOptions} />
    </ResizableBox>
  );
};
