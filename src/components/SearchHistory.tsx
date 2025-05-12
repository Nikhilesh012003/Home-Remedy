
import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Clock, X, History, Search, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchHistoryItem {
  term: string;
  timestamp: number;
}

interface SearchHistorySidebarProps {
  searchHistory: SearchHistoryItem[];
  onHistoryItemClick: (term: string) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (index: number) => void;
  username: string;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const SearchHistorySidebar: React.FC<SearchHistorySidebarProps> = ({
  searchHistory,
  onHistoryItemClick,
  onClearHistory,
  onDeleteHistoryItem,
  username
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        {!isOpen && (
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="fixed left-4 top-20 z-10 flex items-center gap-1 bg-white/80 hover:bg-white" onClick={() => setIsOpen(true)}>
              <History className="h-4 w-4" />
              <span>History</span>
            </Button>
          </DrawerTrigger>
        )}
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Search History for {username}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {searchHistory.length === 0 ? (
                <p className="text-center text-gray-500">No search history found</p>
              ) : (
                <ul className="space-y-2">
                  {searchHistory.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onHistoryItemClick(item.term);
                          setIsOpen(false);
                        }}
                        className="flex-grow justify-start text-left"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">{item.term}</span>
                          <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                        </div>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDeleteHistoryItem(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={onClearHistory} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Clear History
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {!isOpen && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-20 z-10 flex items-center gap-1 bg-white/80 hover:bg-white"
        >
          <History className="h-4 w-4" />
          <span>History</span>
        </Button>
      )}
      
      {isOpen && (
        <Sidebar variant="floating" side="left">
          <SidebarHeader>
            <div className="flex items-center justify-between px-4 pt-2">
              <h3 className="text-lg font-semibold">Search History</h3>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={onClearHistory} className="h-7 text-xs text-red-600">
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-7 text-xs">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{username}'s Searches</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {searchHistory.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">No search history found</div>
                  ) : (
                    searchHistory.map((item, index) => (
                      <SidebarMenuItem key={index}>
                        <div className="flex items-center justify-between w-full">
                          <SidebarMenuButton onClick={() => {
                            onHistoryItemClick(item.term);
                            setIsOpen(false);
                          }}>
                            <Search className="h-4 w-4" />
                            <div className="flex flex-col items-start">
                              <span>{item.term}</span>
                              <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                            </div>
                          </SidebarMenuButton>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteHistoryItem(index);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </SidebarMenuItem>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
    </>
  );
};

export const SearchHistoryButton: React.FC<{
  searchHistory: SearchHistoryItem[];
  onHistoryItemClick: (term: string) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (index: number) => void;
  username: string;
}> = (props) => {
  return <SearchHistorySidebar {...props} />;
};

