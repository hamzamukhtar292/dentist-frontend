// src/app/layout.tsx
import { AuthProvider } from './context/AuthContext';
import { ReactQueryProvider } from './context/ReactQueryProvider';
import './globals.css'
import ToastProvider from "./components/ToastProvider"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
          <ToastProvider>
            {children}
            </ToastProvider>
            </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
