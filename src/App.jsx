import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { RichLayout } from "./variants/rich/RichLayout.jsx";
import { Home } from "./pages/Home.jsx";
import { Shop } from "./pages/Shop.jsx";
import { Product } from "./pages/Product.jsx";
import { Cart } from "./pages/Cart.jsx";
import { Checkout } from "./pages/Checkout.jsx";
import { Info } from "./pages/Info.jsx";
import { ParMums } from "./pages/ParMums.jsx";
import { Kontakti } from "./pages/Kontakti.jsx";
import { PiegadeLapa } from "./pages/PiegadeLapa.jsx";
import { Iepirkties } from "./pages/Iepirkties.jsx";
import { Noteikumi } from "./pages/Noteikumi.jsx";
import { Privatums } from "./pages/Privatums.jsx";

/**
 * Must be an array of `<Route>` nodes (not a wrapper component).
 * React Router only understands Route / Fragment as route config children.
 */
function storeRouteList() {
  return [
    <Route key="index" index element={<Home />} />,
    <Route key="veikals" path="veikals" element={<Shop />} />,
    <Route key="produkts" path="produkts/:id" element={<Product />} />,
    <Route key="grozs" path="grozs" element={<Cart />} />,
    <Route key="noformesana" path="noformesana" element={<Checkout />} />,
    <Route key="informacija" path="informacija" element={<Info />} />,
    <Route key="par-mums" path="par-mums" element={<ParMums />} />,
    <Route key="kontakti" path="kontakti" element={<Kontakti />} />,
    <Route key="piegade" path="piegade" element={<PiegadeLapa />} />,
    <Route key="iepirkties" path="iepirkties" element={<Iepirkties />} />,
    <Route key="noteikumi" path="noteikumi" element={<Noteikumi />} />,
    <Route key="privatums" path="privatums" element={<Privatums />} />,
  ];
}

export default function App() {
  return (
    <>
      <Routes>
      <Route path="/rich/*" element={<RichLayout />}>
        {storeRouteList()}
      </Route>
      <Route path="/" element={<Layout />}>
        {storeRouteList()}
      </Route>
    </Routes>
    </>
  );
}
