import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";

import UsersPage from "./assets/pages/UsersPage";
import ProductsPage from "./assets/pages/ProductsPage";
import ContactPage from "./assets/pages/ContactPage";

export default function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}
