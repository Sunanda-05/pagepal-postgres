const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:4000", "https://7hbrjwbk-4000.inc1.devtunnels.ms"], // List of allowed origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allows cookies to be sent with requests
};

export default corsOptions;
