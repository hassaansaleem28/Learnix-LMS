import { useGetOrdersAnalyticsQuery } from "@/redux-toolkit/features/analytics/analyticsApi";
import React, { FC } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = { isDashboard?: boolean };

const OrdersAnalytics: FC<Props> = ({ isDashboard }) => {
  // const data = [
  //   { name: "Page A", count: 4000 },
  //   { name: "Page B", count: 3000 },
  //   { name: "Page C", count: 5000 },
  //   { name: "Page D", count: 1000 },
  //   { name: "Page E", count: 4000 },
  //   { name: "Page A", count: 4000 },
  //   { name: "Page A", count: 4000 },
  // ];
  const { data, isLoading, error } = useGetOrdersAnalyticsQuery({});
  const analyticsData: any = [];

  data &&
    data?.ordersAnalytics?.last12Months?.forEach((item: any) => {
      analyticsData.push({
        name: item.month,
        Count: item.count,
      });
    });
  console.log(analyticsData);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
          <div
            className={
              isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px] ml-5"
            }
          >
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Orders Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 months analytics data
              </p>
            )}
          </div>
          <div
            className={`w-full ${
              !isDashboard ? "h-[90%]" : "h-full"
            } flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={isDashboard ? "100%" : "50%"}
            >
              <LineChart
                width={500}
                height={300}
                data={analyticsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isDashboard && <Legend />}
                <Line type="monotone" dataKey="Count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersAnalytics;
