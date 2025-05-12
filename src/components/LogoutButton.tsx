
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, ShieldCheck, User } from 'lucide-react';

const LogoutButton = () => {
  const { logout, isAdmin } = useAuth();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={logout}
      className="flex items-center gap-1 bg-white/80 hover:bg-white/90 text-indigo-700 border-indigo-200"
    >
      {isAdmin ? (
        <ShieldCheck className="h-4 w-4" />
      ) : (
        <User className="h-4 w-4" />
      )}
      {isAdmin ? 'Logout (Admin)' : 'Logout (User)'}
    </Button>
  );
};

export default LogoutButton;
