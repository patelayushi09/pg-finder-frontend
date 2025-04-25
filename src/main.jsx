import React, { Children } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Dashboard from './pages/tenants/Dashboard.jsx';
import SearchPG from './pages/tenants/SearchPG';
import MyBookings from './pages/tenants/My Booking.jsx';
import Messages from './pages/tenants/Messages';
import Favorites from './pages/tenants/Favorites';
import Settings from './pages/tenants/Settings';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login } from './pages/tenants/Login.jsx';
import { SignUp } from './pages/tenants/SignUp.jsx';
import { TenantChangePassword } from './pages/tenants/TenantChangePassword.jsx';
import { TenantOtpLogin } from './pages/tenants/TenantOtpLogin.jsx'
import { TenantForgotPassword } from './pages/tenants/TenantForgotPassword.jsx'
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import Message from './pages/admin/Message.jsx';
import Users from './pages/admin/Users.jsx';
import Properties from './pages/admin/Properties.jsx';
import AdminHomePage from './pages/admin/AdminHomePage.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import { AdminLogin } from './pages/admin/AdminLogin.jsx'
import AdminForgotPassword from './pages/admin/AdminForgotPassword.jsx'
import AdminOtpLogin from './pages/admin/AdminOtpLogin.jsx'
import AdminChangePassword from './pages/admin/AdminChangePassword.jsx'
import { LandlordDashboard } from './pages/landlord/LandlordDashboard.jsx';
import LandlordHomePage from './pages/landlord/LandlordHomePage.jsx';
import Property from './pages/landlord/Property.jsx';
import Booking from './pages/landlord/Booking.jsx';
import SettingBox from './pages/landlord/SettingBox.jsx';
import Tenant from './pages/landlord/Tenant.jsx';
import { LandlordSignUp } from './pages/landlord/LandlordSignUp.jsx'
import { LandlordLogin } from './pages/landlord/LandlordLogin.jsx'
import { LandlordChangePassword } from './pages/landlord/LandlordChangePassword.jsx'
import { LandlordForgotPassword } from './pages/landlord/LandlordForgotPassword.jsx'
import { LandlordOtpLogin } from './pages/landlord/LandlordOtpLogin.jsx'
import { ChatProvider } from './context/ChatContext';
import { UserProvider } from './context/UserContext';
import LandlordMessages from './pages/landlord/LandlordMessages.jsx';
import { HomePage } from './pages/tenants/HomePage.jsx';
import  PaymentPage  from './pages/tenants/PaymentPage.jsx'
import LandlordPaymentPage from './pages/landlord/LandlordPaymentPage.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/tenant",
    element: <App />,
    children: [
      {
        path: "/tenant/tenant-dashboard",
        element: <Dashboard />
      },
      {
        path: "/tenant/tenant-dashboard/search-pg",
        element: <SearchPG />
      },
      {
        path: "/tenant/tenant-dashboard/messages",
        element: <Messages />
      },
      {
        path: "/tenant/tenant-dashboard/favorites",
        element: <Favorites />
      },
      {
        path: "/tenant/tenant-dashboard/my-bookings",
        element: <MyBookings />
      },
      {
        path: "/tenant/tenant-dashboard/payment-page",
        element: <PaymentPage />
      },
      {
        path: "/tenant/tenant-dashboard/settings",
        element: <Settings />
      },


    ]
  },
  {
    path: "/tenant/login",
    element: <Login />
  },
  {
    path: "/tenant/signup",
    element: <SignUp />
  },
  {
    path: "/tenant/reset-password",
    element: <TenantChangePassword />
  },
  {
    path: "/tenant/forgot-password",
    element: <TenantForgotPassword />
  },
  {
    path: "/tenant/otp",
    element: <TenantOtpLogin />
  },

  {
    path: "/admin-dashboard/",
    element: <AdminDashboard />,
    children: [
      {
        index: true,
        element: <AdminHomePage />
      },
      {
        path: "users",
        element: <Users />
      },
      {
        path: "properties",
        element: <Properties />
      },
      {
        path: "messages",
        element: <Message />
      },
      {
        path: "analytics",
        element: <Analytics />
      },

    ]
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/admin/forgot-password",
    element: <AdminForgotPassword />
  },
  {
    path: "/admin/otp",
    element: <AdminOtpLogin />
  },
  {
    path: "/admin/reset-password",
    element: <AdminChangePassword />
  },


  {
    path: "/landlord-dashboard/",
    element: <LandlordDashboard />,
    children: [
      {
        index: true,
        element: <LandlordHomePage />
      },
      {
        path: "properties",
        element: <Property />
      },
      {
        path: "messages",
        element: <LandlordMessages />
      },
      {
        path: "bookings",
        element: <Booking />
      },
      {
        path: "settings",
        element: <SettingBox />
      },
      {
        path: "tenants",
        element: <Tenant />
      },
      {
        path: "payments",
        element: <LandlordPaymentPage />
      }
    ]
  },
  {
    path: "/landlord/signup",
    element: <LandlordSignUp />
  },
  {
    path: "/landlord/login",
    element: <LandlordLogin />
  },
  {
    path: "/landlord/forgot-password",
    element: <LandlordForgotPassword />
  },
  {
    path: "/landlord/otp",
    element: <LandlordOtpLogin />
  },
  {
    path: "/landlord/reset-password",
    element: <LandlordChangePassword />
  },

])



createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChatProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ChatProvider>
  </React.StrictMode>
);

