import { Link, useLocation } from 'react-router-dom';
import { Keyboard, BarChart3, History, Settings, Home } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/test', label: 'Test', icon: Keyboard },
  { path: '/practice', label: 'Practice', icon: Keyboard },
  { path: '/statistics', label: 'Stats', icon: BarChart3 },
  { path: '/history', label: 'History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-2 rounded-2xl glass">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-type-accent text-white'
                  : 'text-type-dim hover:text-type-text hover:bg-type-border'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
