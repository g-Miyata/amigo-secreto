'use client';
import { Gift, PlusCircleIcon, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="border-b">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Gift className="h-6 w-6 text-red-400" />
            <span>
              Amigo
              <span className="font-thin">Secreto</span>
            </span>
          </Link>
          <nav className="flex flex-col items-center md:flex-row gap-2  min-w-50">
            <Button asChild variant="outline">
              <Link href="/app/grupos" className={`w-40 text-foreground text-sm flex gap-2 items-center ${pathname === '/app/grupos' ? 'text-red-400' : ''}`}>
                <UsersRound className="w-4 h-4" />
                Meus Grupos
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/app/grupos/novo" className={`${pathname === '/app/grupos/novo' ? 'text-red-400' : ''} w-40`}>
                <PlusCircleIcon className="w-4 h-4" />
                Novo Grupo
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
