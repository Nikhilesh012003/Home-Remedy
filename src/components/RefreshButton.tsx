
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const RefreshButton = ({ onClick, loading = false }: RefreshButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1 bg-white/80 hover:bg-white/90 text-indigo-700 border-indigo-200"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      Refresh
    </Button>
  );
};

export default RefreshButton;
