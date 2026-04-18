import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app.routes';
import { useAuthStore } from './feature/auth/store/auth.store';
import LoadingSpinner from './feature/auth/components/LoaderSpiner';

const App = () => {
  // 🔥 Zustand Best Practice: Sirf wahi nikal jo chahiye (Selectors use kar)
  // Isse faaltu ke re-renders nahi honge aur app fast chalega
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // Dependency array mein checkAuth daalna safe aur sahi practice hai

  // Jab tak profile fetch ho rahi hai, spinner dikha
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  // Fetch hone ke baad hi aage ke routes load kar
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;