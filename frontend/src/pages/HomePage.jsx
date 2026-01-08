import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Users, Sparkles, Heart, Package } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'clientes',
      title: 'Clientes Novos',
      description: 'Rotação de atendimentos',
      icon: Users,
      path: '/clientes',
      color: 'bg-sky-50 hover:bg-sky-100',
      iconColor: 'text-sky-500'
    },
    {
      id: 'cetim',
      title: 'Cetim',
      description: 'Controle de uso',
      icon: Sparkles,
      path: '/cetim',
      color: 'bg-violet-50 hover:bg-violet-100',
      iconColor: 'text-violet-500'
    },
    {
      id: 'depilacao',
      title: 'Depilação',
      description: 'Ordem de atendimento',
      icon: Heart,
      path: '/depilacao',
      color: 'bg-rose-50 hover:bg-rose-100',
      iconColor: 'text-rose-500'
    },
    {
      id: 'estoque',
      title: 'Estoque',
      description: 'Controle de produtos',
      icon: Package,
      path: '/estoque',
      color: 'bg-emerald-50 hover:bg-emerald-100',
      iconColor: 'text-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50">
      <div className="max-w-md mx-auto min-h-screen relative">
        {/* Header */}
        <header className="pt-12 pb-8 px-6 text-center">
          <h1 
            data-testid="app-title"
            className="text-3xl font-semibold tracking-tight text-foreground"
          >
            Espaço Sow
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Alphaville
          </p>
        </header>

        {/* Menu Grid */}
        <main className="px-6 pb-8">
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                data-testid={`menu-${item.id}`}
                onClick={() => navigate(item.path)}
                className={`${item.color} border-0 p-5 cursor-pointer transition-all duration-200 active:scale-95 hover:shadow-md`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-full bg-white/80 shadow-sm`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-medium text-foreground text-base">
                      {item.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Sistema interno de gestão
          </p>
        </footer>
      </div>
    </div>
  );
}
