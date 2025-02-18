"use client";

import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import { Budget, Category } from "@/types";
import TableSkeleton from "@/components/loading/TableSkeleton";
import BudgetTable from "@/components/budget/BudgetTable";
import AddBudget from "@/components/budget/AddBudget";

type CategoryData = {
  name: string;
  budgetAmount: number;
  transactionAmount: number;
};

type MonthData = {
  month: string;
  categories: CategoryData[];
};

type CategoryListResponse = {
  categories?: Category[];
  msg: string;
}

type BudgetResponse = {
  success: boolean;
  data: { monthsData: MonthData[]; budgetData: Budget[] };
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// Function to generate random colors
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const BudgetPage = () => {
  const { data, error, isLoading,mutate } = useSWR<BudgetResponse>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/budget`,
    fetcher
  );

  const { data: categoryData } = useSWR<CategoryListResponse>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`,
    fetcher
  );

  // Extract all unique categories dynamically
  const uniqueCategories = Array.from(
    new Set(
      data?.data.monthsData.flatMap((month) =>
        month.categories.map((c) => c.name)
      ) || []
    )
  );

  // Assign a random color to each category
  const categoryColors: Record<string, string> = uniqueCategories.reduce(
    (acc, category) => {
      acc[category] = getRandomColor();
      return acc;
    },
    {} as Record<string, string>
  );

  // Prepare data for the stacked bar chart
  const chartData =
    data?.data.monthsData
      .map((monthItem) => {
        const monthData: Record<string, any> = { month: monthItem.month };

        monthItem.categories.forEach((category) => {
          monthData[`Transaction - ${category.name}`] =
            category.transactionAmount;
          monthData[`Budget - ${category.name}`] = category.budgetAmount;
        });

        return monthData;
      })
      .reverse() || []; // Reverse for latest month first

  const latestMonth = data?.data.monthsData[0]; // Assuming latest month is at index 0
  const pieChartData =
    latestMonth?.categories.map((category) => ({
      name: category.name,
      value: category.budgetAmount,
    })) || [];

  return (
    <>
      <Card className="p-5 shadow-lg rounded-lg">
        <CardHeader className="flex flex-row justify-between items-center flex-wrap">
          <div>
            <CardTitle className="text-3xl font-bold">
              Budget Overview
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Analyze your budget allocation and actual spending across
              different categories.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="text-center text-lg font-semibold">
              Loading budget data...
            </p>
          ) : error ? (
            <p className="text-red-500 text-center text-lg">
              Failed to load budget data
            </p>
          ) : (
            <>
              {/* Pie Chart for Latest Month */}
              {latestMonth && (
                <>
                  <h2 className="text-2xl font-semibold text-center mt-8">
                    Budget Allocation for {latestMonth.month}
                  </h2>
                  <p className="text-center text-gray-500 mb-4">
                    Breakdown of budgeted amounts per category
                  </p>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={categoryColors[entry.name]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </>
              )}

              {/* Bar Chart for Budget vs Transaction */}
              <h2 className="text-2xl font-semibold text-center mt-12">
                Budget vs Actual Spending
              </h2>
              <p className="text-center text-gray-500 mb-4">
                Compare planned budgets with real transactions over the months.
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} barGap={10}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  {/* Stacked Bars for Transactions */}
                  {uniqueCategories.map((category) => (
                    <Bar
                      key={`Transaction - ${category}`}
                      dataKey={`Transaction - ${category}`}
                      stackId="Transaction"
                      fill={categoryColors[category]}
                    />
                  ))}

                  {/* Stacked Bars for Budgets */}
                  {uniqueCategories.map((category) => (
                    <Bar
                      key={`Budget - ${category}`}
                      dataKey={`Budget - ${category}`}
                      stackId="Budget"
                      fill={categoryColors[category]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="p-5 shadow-lg rounded-lg">
        <CardHeader className="flex flex-row justify-between items-center flex-wrap">
          <div>
            <CardTitle className="text-3xl font-bold">Budget Table</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              View a detailed breakdown of your budget allocations and actual
              spending.
            </CardDescription>
            <div className='flex gap-2 flex-wrap'>
            <AddBudget mutate={mutate} /> 
            </div>
          </div>
          <div className="flex items-center flex-wrap">

          </div>
        </CardHeader>
        <CardContent>
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <p className="text-red-500 text-center py-4">Failed to load transactions.</p>
        ) : (
          
          <BudgetTable budget={data?.data.budgetData ?? []} mutate = {mutate} categories={categoryData?.categories ?? []} />
     

        )}

        </CardContent>
      </Card>
    </>
  );
};

export default BudgetPage;
