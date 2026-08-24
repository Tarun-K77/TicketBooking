import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import MyTickets from './pages/MyTickets';
import Login from './pages/Login';
import Register from './pages/Register';
import DigitalTicket from './pages/DigitalTicket';
import Profile from './pages/Profile';
import BookingSuccess from './pages/BookingSuccess';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/seats" element={<SeatSelection />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<BookingSuccess />} />
            <Route path="/bookings" element={<MyTickets />} />
            <Route path="/ticket" element={<DigitalTicket />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
