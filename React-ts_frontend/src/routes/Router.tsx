import { createBrowserRouter } from "react-router-dom";

import Home from "@/views/Home/Home";
import Home2 from "@/views/Homev2/Home";
import HomeLayout from "@/layouts/HomeLayout";
import DashboardLayout from "@/layouts/DahboardLayout";
import RequireAuth from "./RequireAuth";

import FactoryDashboard from "@/views/Overview/FactoryDashboard";
import FactoryDigitalTwin from "@/views/Overview/FactoryDigitalTwin";
import Dash from "@/views/Overview/Dash";
import TestFetch from "@/views/TestFetch";
import TestSignal from "@/views/TestSignal";
import TestWp from "@/views/TestWp";

import WorkpieceManagement from "@/views/WorkpieceManagement/WorkpieceManagement";
import OrderManagement from "@/views/WorkpieceManagement/OrderManagement";

import OperationsManagementPage from "@/views/pages/OperationsManagementPage";
import AlertsPage from "@/views/pages/AlertsPage";
import AccessibilityPage from "@/views/pages/AccessibilityPage";
import NotFound from "@/views/pages/NotFound";

import DrillDash from "@/views/ModulesDashboards/DrillDashboard/DrillDash";
import MillDash from "@/views/ModulesDashboards/MillDashboard/MillDash";
import AiqsDash from "@/views/ModulesDashboards/AiqsDashboard/AiqsDashboard";
import DpsDash from "@/views/ModulesDashboards/DpsDashboard/DpsDashboard";
import HbwDash from "@/views/ModulesDashboards/HbwDashboard/HbwDashboard";

import FactoryDash from "@/views/DashboardFactory/FactoryDash";
import Login from "@/views/auth/Login";
import Register from "@/views/auth/Register";
import RequireLogout from "./RequireLogout";
import SettingsPage from "@/views/settings/SettingsPage";
import UserAccessSettings from "@/views/settings/UserAccessSettings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <Home2 />,
      },
      {
        path: "login",
        element: (
          <RequireLogout>
            <Login />
          </RequireLogout>
        ),
      },
      {
        path: "register",
        element: (
          <RequireLogout>
            <Register />
          </RequireLogout>
        ),
      },
      // Catch-all for unknown paths under Home layout
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  {
    path: "dashboard",
    element: (
      <RequireAuth>
        <DashboardLayout currentView="overview" onViewChange={() => {}} />
      </RequireAuth>
    ),
    children: [
      {
        path: "",
        element: <FactoryDigitalTwin />,
      },
      {
        path: "monitoring",
        element: <FactoryDash />,
      },
      {
        path: "test",
        element: <TestFetch />,
      },
      {
        path: "dash",
        element: <Dash />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "management",
        element: <OperationsManagementPage />,
      },
      {
        path: "alerts",
        element: <AlertsPage />,
      },
      {
        path: "accessibility",
        element: <UserAccessSettings />,
      },
      {
        path: "drill001",
        element: <DrillDash />,
      },
      {
        path: "mill001",
        element: <MillDash />,
      },
      {
        path: "aiqs001",
        element: <AiqsDash />,
      },
      {
        path: "dps001",
        element: <DpsDash />,
      },
      {
        path: "hbw001",
        element: <HbwDash />,
      },
      // Catch-all for unknown dashboard subpaths
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // Global fallback (if no layout matched)
  {
    path: "*",
    element: 
        <NotFound />
  ,
  },
]);

export default router;
