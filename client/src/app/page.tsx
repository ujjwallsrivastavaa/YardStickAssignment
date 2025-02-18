"use client";
import { Budget, Category, Transaction } from "@/types";
import axios from "axios";
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
import AddBudget from "@/components/budget/AddBudget";
import AddCategory from "@/components/AddCategory";
import AddTransaction from "@/components/transactions/AddTransaction";
import TableSkeleton from "@/components/loading/TableSkeleton";
import TransactionsTable from "@/components/transactions/TransactionTable";
type CategoryData = {
  name: string;
  transactionAmount: number;
};

type MonthData = {
  month: string;
  categories: CategoryData[];
};

type CategoryListResponse = {
  categories?: Category[];
  msg: string;
};

type BudgetResponse = {
  success: boolean;
  data: {
    monthsData: MonthData[];
    budgetData: Budget[];
    transactionData: Transaction[];
  };
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};
export default function Home() {
  const { data, error, isLoading, mutate } = useSWR<BudgetResponse>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/`,
    fetcher
  );

  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryIsLoading,
    mutate: categoryMutate,
  } = useSWR<CategoryListResponse>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`,
    fetcher
  );

  const uniqueCategories = Array.from(
    new Set(
      data?.data.monthsData.flatMap((month) =>
        month.categories.map((c) => c.name)
      ) || []
    )
  );

  const categoryColors: Record<string, string> = uniqueCategories.reduce(
    (acc, category) => {
      acc[category] = getRandomColor();
      return acc;
    },
    {} as Record<string, string>
  );

  const chartData =
    data?.data.monthsData
      .map((monthItem) => {
        const monthData: Record<string, any> = { month: monthItem.month };

        monthItem.categories.forEach((category) => {
          monthData[`Transaction - ${category.name}`] =
            category.transactionAmount;
        });

        return monthData;
      })
      .reverse() || [];

  const latestMonth = data?.data.monthsData[0];
  const pieChartData =
    latestMonth?.categories.map((category) => ({
      name: category.name,
      value: category.transactionAmount,
    })) || [];

  return (
    <div>
      <Card className="p-5 shadow-lg rounded-lg">
        <CardHeader className="flex flex-row justify-between items-center flex-wrap">
          <div>
            <CardTitle className="text-3xl font-bold">Dashboard</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Overview of your financial transactions, budgets, and categories.
            </CardDescription>
            <div className="flex gap-2 flex-wrap">
              <AddTransaction />
              <AddBudget />
              <AddCategory />
            </div>
          </div>
          <div className="flex items-center flex-wrap"></div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error fetching data...</p>
          ) : (
            data && (
              <div>
                <div className="flex space-x-4 flex-wrap">
                  <Card className="flex-1">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold">
                        Total Monthly Expenses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data.data.monthsData[0].categories.reduce(
                        (sum, category) => sum + category.transactionAmount,
                        0
                      )}
                    </CardContent>
                  </Card>

                  <Card className="flex-1">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold">
                        Total Monthly Budget
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data.data.budgetData.reduce(
                        (sum, budget) => sum + budget.amount,
                        0
                      )}
                    </CardContent>
                  </Card>

                  <Card
                    className={`flex-1 ${
                      data.data.budgetData.reduce(
                        (sum, budget) => sum + budget.amount,
                        0
                      ) -
                        data.data.monthsData[0].categories.reduce(
                          (sum, category) => sum + category.transactionAmount,
                          0
                        ) <
                      0
                        ? "bg-red-500" // Negative balance
                        : "bg-green-500" // Positive balance
                    }`}
                  >
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold">
                        Remaining Amount
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data.data.budgetData.reduce(
                        (sum, budget) => sum + budget.amount,
                        0
                      ) -
                        data.data.monthsData[0].categories.reduce(
                          (sum, category) => sum + category.transactionAmount,
                          0
                        )}
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  {latestMonth && (
                    <div className="md:w-1/2">
                      <h2 className="text-2xl font-semibold text-center mt-8">
                        Transaction 
                      </h2>
                      <p className="text-center text-gray-500 mb-4">
                        Breakdown of transactions amounts per category
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
                    </div>
                  )}

                  <div className="md:w-1/2">
                    <h2 className="text-2xl font-semibold text-center mt-12">
                      Spending
                    </h2>
                    <p className="text-center text-gray-500 mb-4">
                      Transactions over the months.
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={chartData} barGap={10}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {uniqueCategories.map((category) => (
                          <Bar
                            key={`Transaction - ${category}`}
                            dataKey={`Transaction - ${category}`}
                            stackId="Transaction"
                            fill={categoryColors[category]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>




      <Card className="p-5 shadow-lg rounded-lg mt-5">
        <CardHeader className="flex flex-row justify-between items-center flex-wrap">
          <div>

          <CardTitle className="text-3xl font-bold">
            Recent Transaction
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            A quick glance at your 5 most recent transactions
          </CardDescription>
          </div>

        </CardHeader>
        <CardContent>


          
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <p className="text-red-500 text-center py-4">
            Failed to load transactions.
          </p>
        ) :  data && (
            <TransactionsTable
              transactions={data.data.transactionData ?? []}
              mutate={mutate}
              categories={categoryData?.categories ?? []}
            />
            
        )}
        </CardContent>
      </Card>

    </div>
  );
}
