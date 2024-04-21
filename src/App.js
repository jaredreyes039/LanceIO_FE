import "./App.css";
import "./styles/login.css";
import "./styles/components/modals.css";
import "./styles/components/inputs.css";
import Login from "./pages/Login.page";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.page";
import Invoices from "./pages/Invoices.page";
import Services from "./pages/Services.page";
import User from "./pages/User.page";
import { AnimatePresence } from "framer-motion";
import ModalProvider from "./providers/modal.provider";
import FormSliderProvider from "./providers/formSlider.provider";
import ServiceDataProvider from "./providers/servicesData.provider";
import "react-toastify/dist/ReactToastify.css";
import "./styles/components/inputs.css";

function App() {
  const location = useLocation();
  return (
    <>
      <ServiceDataProvider>
        <FormSliderProvider>
          <ModalProvider>
            <AnimatePresence mode="wait">
              <Routes key={location.pathname} location={location}>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/services" element={<Services />} />
                <Route path="/user" element={<User />} />
              </Routes>
            </AnimatePresence>
          </ModalProvider>
        </FormSliderProvider>
      </ServiceDataProvider>
    </>
  );
}

export default App;
