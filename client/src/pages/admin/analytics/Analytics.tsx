import Loading from "@/components/loader/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/constants";
import { useGetDashboardSummaryQuery } from "@/redux/features/analytics.api";
import type { iDashboardAnalyticsResponse } from "@/types";
import type { iParcelStatus } from "@/types/analytics.type";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  Filter,
  Package,
  Truck,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type iUserRole = "ADMIN" | "SENDER" | "RECEIVER";

// -------------------------- Types --------------------------
interface ITopUser {
  _id: string;
  totalSent?: number;
  totalReceived?: number;
  name: string;
  email: string;
  role: iUserRole;
  count: number;
}

// -------------------------- CSV Export --------------------------
const exportToCSV = (data: ITopUser[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    const values = headers.map((h) => JSON.stringify(row[h as keyof ITopUser] ?? ""));
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
};

// -------------------------- Monthly Trend Chart --------------------------
interface MonthlyTrendProps {
  monthlyTrend: iDashboardAnalyticsResponse["monthlyTrend"];
}

const MonthlyTrendChart = ({ monthlyTrend }: MonthlyTrendProps) => {
  const monthLabels = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const chartData = monthlyTrend.map((m) => ({
    month: monthLabels[m.month],
    total: m.total,
  }));

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">📈 Monthly Parcel Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill="#3b82f6" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// -------------------------- Parcel Status Overview --------------------------
interface ParcelStatusProps {
  parcelStatusStats: iDashboardAnalyticsResponse["parcelStatusStats"];
}

const statusColors: Partial<Record<iParcelStatus, string>> = {
  Requested: "bg-gray-300 text-gray-700",
  In_Transit: "bg-blue-200 text-blue-800",
  Delivered: "bg-green-200 text-green-800",
  Cancelled: "bg-red-200 text-red-800",
};

const ParcelStatusOverview = ({ parcelStatusStats }: ParcelStatusProps) => {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">📦 Parcel Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(parcelStatusStats).map(([status, count], i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }}>
              <Card className="flex flex-col items-center p-4 border shadow-sm">
                <Badge className={`mb-2 ${statusColors[status as iParcelStatus]}`}>
                  {status.replace(/_/g, " ")}
                </Badge>
                <div className="text-2xl font-bold">{count}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// -------------------------- Delivery Performance --------------------------
interface DeliveryPerformanceProps {
  delivered: number;
  cancelled: number;
  inTransit: number;
}

const DeliveryPerformance = ({
  delivered,
  cancelled,
  inTransit,
}: DeliveryPerformanceProps) => (
  <Card className="p-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">🚚 Delivery Performance</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center p-4 border shadow-sm">
          <CheckCircle className="h-6 w-6 text-green-500 mb-1" />
          <div className="text-xl font-bold">{delivered}</div>
          <p className="text-sm text-muted-foreground">Delivered</p>
        </Card>
        <Card className="flex flex-col items-center p-4 border shadow-sm">
          <XCircle className="h-6 w-6 text-red-500 mb-1" />
          <div className="text-xl font-bold">{cancelled}</div>
          <p className="text-sm text-muted-foreground">Cancelled</p>
        </Card>
        <Card className="flex flex-col items-center p-4 border shadow-sm">
          <Truck className="h-6 w-6 text-blue-500 mb-1" />
          <div className="text-xl font-bold">{inTransit}</div>
          <p className="text-sm text-muted-foreground">In Transit</p>
        </Card>
      </div>
    </CardContent>
  </Card>
);

// -------------------------- User Role Stats --------------------------
interface UserRoleStatsProps {
  userRoleStats: iDashboardAnalyticsResponse["userRoleStats"];
}

const UserRoleStats = ({ userRoleStats }: UserRoleStatsProps) => (
  <Card className="p-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">👥 User Role Distribution</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid sm:grid-cols-3 gap-4">
        {Object.entries(userRoleStats).map(([role, count], i) => (
          <Card key={i} className="flex flex-col items-center p-4 border shadow-sm">
            <div className="text-xl font-bold">{count}</div>
            <p className="text-sm text-muted-foreground">{role}</p>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

// -------------------------- Main Analytics Component --------------------------
export default function Analytics() {
  const [filters, setFilters] = useState({
    role: "ALL" as "ALL" | iUserRole,
    startDate: "",
    endDate: "",
  });

  const { data, isLoading, isError } = useGetDashboardSummaryQuery();
  const summary: iDashboardAnalyticsResponse | undefined = data?.data;

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Something went wrong while fetching analytics data.
      </div>
    );

  const topUsers: ITopUser[] = [
    ...(summary?.topUsers.topSenders.map((u) => ({
      _id: u._id,
      name: `${u.senderInfo.name.firstName} ${u.senderInfo.name.lastName}`,
      email: u.senderInfo.email,
      role: ROLES.SENDER,
      count: u.totalSent,
    })) || []),
    ...(summary?.topUsers.topReceivers.map((u) => ({
      _id: u._id,
      name: `${u.receiverInfo.name.firstName} ${u.receiverInfo.name.lastName}`,
      email: u.receiverInfo.email,
      role: ROLES.RECEIVER,
      count: u.totalReceived,
    })) || []),
  ];

  const filteredTopUsers =
    filters.role === "ALL" ? topUsers : topUsers.filter((u) => u.role === filters.role);

  return (
    <div className="p-6 space-y-10 animate-fadeIn">
      {/* HEADER */}
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold">📊 Admin Dashboard Analytics</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive overview of logistics performance, user activity, and parcel
          distribution.
        </p>
      </section>

      {/* FILTERS */}
      <Card className="p-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" /> Filters & Data Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm mb-1 text-muted-foreground">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1 text-muted-foreground">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1 text-muted-foreground">User Role</label>
              <Select
                value={filters.role}
                onValueChange={(role) =>
                  setFilters({ ...filters, role: role as "ALL" | iUserRole })
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SENDER">Sender</SelectItem>
                  <SelectItem value="RECEIVER">Receiver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto">
              <Button
                className="flex items-center gap-2"
                onClick={() => exportToCSV(filteredTopUsers, "dashboard_analytics")}
              >
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BASIC COUNTS */}
      <section>
        <h2 className="text-2xl font-bold mb-3">🔹 Basic Statistics</h2>
        <p className="text-muted-foreground mb-5">
          Quick insights into total parcels, users, and system health indicators.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(summary?.counts || {}).map(([key, value], i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }}>
              <Card className="border shadow-sm">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="capitalize text-sm font-medium">
                    {key.replace(/([A-Z])/g, " $1")}
                  </CardTitle>
                  {i % 2 === 0 ? (
                    <Package className="h-5 w-5 text-primary" />
                  ) : (
                    <Users className="h-5 w-5 text-primary" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOP USERS */}
      <section>
        <h2 className="text-2xl font-bold mb-3">🏅 Top Users</h2>
        <p className="text-muted-foreground mb-5">
          Users with the highest engagement and number of parcels handled.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopUsers.map((user, i) => (
            <Card
              key={i}
              className="flex items-center gap-3 p-4 hover:shadow-md transition-all"
            >
              <Users className="text-primary h-10 w-10" />
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">Parcels: {user.count}</p>
                <p className="text-xs text-muted-foreground">Role: {user.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* MONTHLY TREND */}
      <MonthlyTrendChart monthlyTrend={summary?.monthlyTrend || []} />

      {/* PARCEL STATUS */}
      <ParcelStatusOverview parcelStatusStats={summary?.parcelStatusStats || {}} />

      {/* DELIVERY PERFORMANCE */}
      <DeliveryPerformance
        delivered={summary?.deliveryPerformance.delivered || 0}
        cancelled={summary?.deliveryPerformance.cancelled || 0}
        inTransit={summary?.deliveryPerformance.inTransit || 0}
      />

      {/* USER ROLE STATS */}
      <UserRoleStats
        userRoleStats={summary?.userRoleStats || { ADMIN: 0, SENDER: 0, RECEIVER: 0 }}
      />
    </div>
  );
}
