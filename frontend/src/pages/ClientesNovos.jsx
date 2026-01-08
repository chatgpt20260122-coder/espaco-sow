import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft, Plus, Trash2, Check, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientesNovos() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useLocalStorage('espacosow_clientes', []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    data: new Date().toISOString().split('T')[0],
    profissional: '',
    servico: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.profissional || !formData.servico) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const novoCliente = {
      id: Date.now().toString(),
      ...formData,
      atendido: false,
      criadoEm: new Date().toISOString()
    };

    setClientes([novoCliente, ...clientes]);
    setFormData({
      nome: '',
      data: new Date().toISOString().split('T')[0],
      profissional: '',
      servico: ''
    });
    setShowForm(false);
    toast.success('Cliente adicionado com sucesso!');
  };

  const toggleAtendido = (id) => {
    setClientes(clientes.map(c => 
      c.id === id ? { ...c, atendido: !c.atendido } : c
    ));
    toast.success('Status atualizado!');
  };

  const removerCliente = (id) => {
    setClientes(clientes.filter(c => c.id !== id));
    toast.success('Cliente removido!');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  const clientesOrdenados = [...clientes].sort((a, b) => 
    new Date(b.data) - new Date(a.data)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50">
      <div className="max-w-md mx-auto min-h-screen relative pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-border/50 px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              data-testid="btn-voltar"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-500" />
              <h1 className="text-xl font-semibold">Clientes Novos</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 py-6">
          {showForm ? (
            <Card className="border-0 shadow-lg" data-testid="form-cliente">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Novo Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nome do Cliente *
                    </label>
                    <Input
                      data-testid="input-nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Nome completo"
                      className="mt-1 h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Data *
                    </label>
                    <Input
                      data-testid="input-data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="mt-1 h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Profissional *
                    </label>
                    <Input
                      data-testid="input-profissional"
                      value={formData.profissional}
                      onChange={(e) => setFormData({ ...formData, profissional: e.target.value })}
                      placeholder="Nome do profissional"
                      className="mt-1 h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Serviço Realizado *
                    </label>
                    <Input
                      data-testid="input-servico"
                      value={formData.servico}
                      onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                      placeholder="Ex: Corte, Coloração..."
                      className="mt-1 h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      data-testid="btn-cancelar"
                      onClick={() => setShowForm(false)}
                      className="flex-1 h-12 rounded-full"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      data-testid="btn-salvar"
                      className="flex-1 h-12 rounded-full bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/20"
                    >
                      Salvar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {clientesOrdenados.length === 0 ? (
                <Card className="border-0 shadow-sm p-8 text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground mt-4">
                    Nenhum cliente cadastrado
                  </p>
                </Card>
              ) : (
                clientesOrdenados.map((cliente) => (
                  <Card 
                    key={cliente.id}
                    data-testid={`cliente-${cliente.id}`}
                    className={`border-0 shadow-sm transition-all ${
                      cliente.atendido ? 'opacity-60 bg-muted/50' : 'bg-white'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          data-testid={`checkbox-${cliente.id}`}
                          checked={cliente.atendido}
                          onCheckedChange={() => toggleAtendido(cliente.id)}
                          className="mt-1 h-5 w-5 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium truncate ${
                              cliente.atendido ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {cliente.nome}
                            </h3>
                            {cliente.atendido && (
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="bg-secondary px-2 py-1 rounded-full">
                              {formatDate(cliente.data)}
                            </span>
                            <span className="bg-sky-50 text-sky-600 px-2 py-1 rounded-full">
                              {cliente.profissional}
                            </span>
                            <span className="bg-violet-50 text-violet-600 px-2 py-1 rounded-full">
                              {cliente.servico}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`btn-remover-${cliente.id}`}
                          onClick={() => removerCliente(cliente.id)}
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </main>

        {/* FAB */}
        {!showForm && (
          <Button
            data-testid="btn-adicionar"
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-sky-500 hover:bg-sky-600 shadow-xl shadow-sky-500/30"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
