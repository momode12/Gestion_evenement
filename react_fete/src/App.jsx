import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Dashboard from "./Pages/Dashboard";
import Customers from "./Components/Customers/Customers";
import User from "./Components/User/User";
import Entree_Sortie from "./Components/Entree_Sortie/Entree_Sortie";
import Sidebar from "./Pages/Sidebar";
import List_client from "./Components/2_date/List_client";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/" element={<Sidebar />}>
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/user" element={<User />} />
          <Route path="/entree_sortie" element={<Entree_Sortie />} />
          <Route path="/list_client" element={<List_client />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
