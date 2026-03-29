import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import View from "@/pages/View";
import Kiosk from "@/pages/Kiosk";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<View />} />
        <Route path="/kiosk" element={<Kiosk />} />
      </Routes>
    </Router>
  );
}
