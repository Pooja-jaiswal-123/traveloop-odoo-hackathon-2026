import "./globals.css";
import AuthProvider from "@/components/shared/AuthProvider";
export const metadata = {
	title: "Traveloop - Personalized Travel Planning",
	description: "Transform the way you plan and experience travel with intelligent itineraries.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="antialiased min-h-screen bg-white">
				{/* AuthProvider poore app ko wrap kar raha hai taaki session har jagah mil sake */}
				<AuthProvider>
					{children}
				</AuthProvider>
			</body>
		</html>
	);
}