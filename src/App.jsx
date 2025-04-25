import { Outlet } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { UserProvider } from "./context/UserContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function App() {
  return (
    <ChatProvider>
      <UserProvider>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Header />
            <main className="p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </UserProvider>
    </ChatProvider>
  );
}

export default App;
