import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Plus, Heart, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

export default function Depilacao() {
  const navigate = useNavigate();
  const [filas, setFilas] = useLocalStorage('espacosow_depilacao', []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    tipoDepilacao: '',
    profissional: '',
    data: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.tipoDepilacao) {
      toast.error('Preencha nome e tipo de depilação');
      return;
    }

    const novaFila = {
      id: Date.now().toString(),
      ...formData,
      ordem: filas.length + 1,
      criadoEm: new Date().toISOString()
    };

    setFilas([...filas, novaFila]);
    setFormData({
      nome: '',
      tipoDepilacao: '',
      profissional: '',
      data: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
    toast.success('Cliente adicionado à fila!');
  };

  const moverPosicao = (id, direcao) => {
    const index = filas.findIndex(f => f.id === id);
    if (index === -1) return;
    
    const novoIndex = direcao === 'up' ? index - 1 : index + 1;
    if (novoIndex < 0 || novoIndex >= filas.length) return;

    const novasFila = [...filas];
    [novasFila[index], novasFila[novoIndex]] = [novasFila[novoIndex], novasFila[index]];
    
    // Atualizar ordem
    novasFila.forEach((item, i) => {
      item.ordem = i + 1;
    });
    
    setFilas(novasFila);
  };

  const removerFila = (id) => {
    const novasFila = filas.filter(f => f.id !== id);
    novasFila.forEach((item, i) => {
      item.ordem = i + 1;
    });
    setFilas(novasFila);
    toast.success('Cliente removido da fila!');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit'
    });
  };

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
              <Heart className="w-5 h-5 text-rose-500" />
              <h1 className="text-xl font-semibold">Rotação Depilação</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 py-6">
          {showForm ? (
            <Card className="border-0 shadow-lg" data-testid="form-depilacao">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Adicionar à Fila</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nome da Cliente *
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
                      Tipo de Depilação *
                    </label>
                    <Input
                      data-testid="input-tipo"
                      value={formData.tipoDepilacao}
                      onChange={(e) => setFormData({ ...formData, tipoDepilacao: e.target.value })}
                      placeholder="Ex: Meia perna, Virilha..."
                      className="mt-1 h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Profissional
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
                      Data
                    </label>
                    <Input
                      data-testid="input-data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="mt-1 h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary"
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
                      className="flex-1 h-12 rounded-full bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                    >
                      Adicionar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Fila Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Ordem de Atendimento
                </h2>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  {filas.length} na fila
                </span>
              </div>

              {filas.length === 0 ? (
                <Card className="border-0 shadow-sm p-8 text-center">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground mt-4">
                    Nenhuma cliente na fila
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filas.map((fila, index) => (
                    <Card 
                      key={fila.id}
                      data-testid={`fila-${fila.id}`}
                      className={`border-0 shadow-sm transition-all ${
                        index === 0 ? 'bg-rose-50 ring-2 ring-rose-200' : 'bg-white'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Posição */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-rose-500 text-white' : 'bg-secondary text-muted-foreground'
                          }`}>
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {fila.nome}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                                {fila.tipoDepilacao}
                              </span>
                              {fila.profissional && (
                                <span className="text-xs text-muted-foreground">
                                  {fila.profissional}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(fila.data)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              data-testid={`btn-up-${fila.id}`}
                              onClick={() => moverPosicao(fila.id, 'up')}
                              disabled={index === 0}
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              data-testid={`btn-down-${fila.id}`}
                              onClick={() => moverPosicao(fila.id, 'down')}
                              disabled={index === filas.length - 1}
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            data-testid={`btn-remover-${fila.id}`}
                            onClick={() => removerFila(fila.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* FAB */}
        {!showForm && (
          <Button
            data-testid="btn-adicionar"
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/30"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
