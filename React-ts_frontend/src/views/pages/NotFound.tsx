import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white">
    <h1 className="text-5xl font-bold text-green-600 mb-4">404</h1>
    <p className="text-lg text-gray-700 mb-8">Sorry, the page you are looking for does not exist.</p>
    <Link
      to="/"
      className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow hover:shadow-md focus:outline-none"
    >
      Return to Home
    </Link>
  </div>
);

export default NotFound;
