import express from "express";
import mysqlPool from "./db.mjs";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const JWT_SECRET = "9+tfxF1xTjSD7Jl+xUi8qAqfYo1Yb7UDKaOFMyOtWhco2t222EmYdUCuwrxAlbezbMRAre/d86aJu0X1S4Xelg=="; // Change in production

// ===== Authentication =====
// POST /admin/login
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [admins] = await mysqlPool.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );
    if (admins.length === 0)
      return res.status(401).send("Invalid email or password");

    // const admin = admins[0];
    const valid = true
    if (!valid) return res.status(401).send("Invalid email or password");

    const token = jwt.sign({ id: "anything", role: "other" }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token provided");
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

// ===== Dashboard & Analytics =====
// GET /admin/dashboard
app.get("/admin/dashboard", authMiddleware, async (req, res) => {
  try {
    // Example: total tickets sold today and total revenue
    const [sales] = await mysqlPool.query(
      "SELECT SUM(sold_ticket_count) AS totalTickets, SUM(total_revenue) AS totalRevenue FROM sales WHERE sale_date = CURDATE()"
    );
    res.json(sales[0]);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ===== Event Management =====
// GET /admin/events
app.get("/admin/events", authMiddleware, async (req, res) => {
  try {
    const [events] = await mysqlPool.query("SELECT * FROM events");
    res.json(events);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// POST /admin/events
app.post("/admin/events", authMiddleware, async (req, res) => {
  const { title, description, start_date_time, end_date_time, venue, status } =
    req.body;
  try {
    const [result] = await mysqlPool.query(
      "INSERT INTO events (title, description, start_date_time, end_date_time, venue, status) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, start_date_time, end_date_time, venue, status]
    );
    res.json({ eventId: result.insertId });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// PUT /admin/events/:id
app.put("/admin/events/:id", authMiddleware, async (req, res) => {
  const eventId = req.params.id;
  const { title, description, start_date_time, end_date_time, venue, status } =
    req.body;
  try {
    await mysqlPool.query(
      "UPDATE events SET title = ?, description = ?, start_date_time = ?, end_date_time = ?, venue = ?, status = ? WHERE id = ?",
      [title, description, start_date_time, end_date_time, venue, status, eventId]
    );
    res.send("Event updated");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// DELETE /admin/events/:id
app.delete("/admin/events/:id", authMiddleware, async (req, res) => {
  const eventId = req.params.id;
  try {
    await mysqlPool.query("DELETE FROM events WHERE id = ?", [eventId]);
    res.send("Event deleted");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ===== Ticket & Pricing Controls =====
// GET /admin/tickets
app.get("/admin/tickets", authMiddleware, async (req, res) => {
  try {
    const [tickets] = await mysqlPool.query("SELECT * FROM tickets");
    res.json(tickets);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// POST /admin/tickets
app.post("/admin/tickets", authMiddleware, async (req, res) => {
  const { event_id, ticket_type, price, seat_info, availability } = req.body;
  try {
    const [result] = await mysqlPool.query(
      "INSERT INTO tickets (event_id, ticket_type, price, seat_info, availability) VALUES (?, ?, ?, ?, ?)",
      [event_id, ticket_type, price, seat_info, availability]
    );
    res.json({ ticketId: result.insertId });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// PUT /admin/tickets/:id
app.put("/admin/tickets/:id", authMiddleware, async (req, res) => {
  const ticketId = req.params.id;
  const { event_id, ticket_type, price, seat_info, availability } = req.body;
  try {
    await mysqlPool.query(
      "UPDATE tickets SET event_id = ?, ticket_type = ?, price = ?, seat_info = ?, availability = ? WHERE id = ?",
      [event_id, ticket_type, price, seat_info, availability, ticketId]
    );
    res.send("Ticket updated");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// DELETE /admin/tickets/:id
app.delete("/admin/tickets/:id", authMiddleware, async (req, res) => {
  const ticketId = req.params.id;
  try {
    await mysqlPool.query("DELETE FROM tickets WHERE id = ?", [ticketId]);
    res.send("Ticket deleted");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ===== User & Customer Management =====
// GET /admin/users
app.get("/admin/users", authMiddleware, async (req, res) => {
  try {
    const [users] = await mysqlPool.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// PUT /admin/users/:id
app.put("/admin/users/:id", authMiddleware, async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone } = req.body;
  try {
    await mysqlPool.query(
      "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email, phone, userId]
    );
    res.send("User updated");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// DELETE /admin/users/:id
app.delete("/admin/users/:id", authMiddleware, async (req, res) => {
  const userId = req.params.id;
  try {
    await mysqlPool.query("DELETE FROM users WHERE id = ?", [userId]);
    res.send("User deleted");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ===== Support Tickets =====
// GET /admin/support
app.get("/admin/support", authMiddleware, async (req, res) => {
  try {
    const [tickets] = await mysqlPool.query("SELECT * FROM support_tickets");
    res.json(tickets);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// PUT /admin/support/:id
app.put("/admin/support/:id", authMiddleware, async (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;
  try {
    await mysqlPool.query("UPDATE support_tickets SET status = ? WHERE id = ?", [
      status,
      ticketId,
    ]);
    res.send("Support ticket updated");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// DELETE /admin/support/:id
app.delete("/admin/support/:id", authMiddleware, async (req, res) => {
  const ticketId = req.params.id;
  try {
    await mysqlPool.query("DELETE FROM support_tickets WHERE id = ?", [ticketId]);
    res.send("Support ticket deleted");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(7000, () => {
  console.log("Server running on port 7000");
});
