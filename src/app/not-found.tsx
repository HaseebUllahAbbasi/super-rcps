import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page not found</h2>
            <p className="text-gray-500 mb-6">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>
            <Link
                href="/"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2 rounded transition"
            >
                Go back home
            </Link>
        </div>
    );
}
