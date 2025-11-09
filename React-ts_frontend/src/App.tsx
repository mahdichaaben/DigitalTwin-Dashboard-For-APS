import { AuthProvider } from "@/contexts/AuthContext";
import router from "@/routes/Router";
import { RouterProvider } from "react-router-dom";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
