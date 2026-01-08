import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Plus, Sparkles, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Cetim() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useLocalStorage('espacosow_cetim', []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    profissional: '',
    data: new Date().toISOString().split('T')[0],
    observacoes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.profissional) {
      toast.error('Informe o profissional responsável');
      return;
    }

    const novoRegistro = {
      id: Date.now().toString(),
      ...formData,
      criadoEm: new Date().toISOString()
    };

    setRegistros([novoRegistro, ...registros]);
    setFormData({
      profissional: '',
      data: new Date().toISOString().split('T')[0],
      observacoes: ''
    });
    setShowForm(false);
    toast.success('Uso de cetim registrado!');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  const formatTime = (isoStr) => {
    const date = new Date(isoStr);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
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
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h1 className="text-xl font-semibold">Rotação de Cetim</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 py-6">
          {showForm ? (
            <Card className="border-0 shadow-lg" data-testid="form-cetim">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Novo Registro</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Profissional Responsável *
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
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Observações
                    </label>
                    <Textarea
                      data-testid="input-observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      placeholder="Observações adicionais..."
                      className="mt-1 min-h-[100px] rounded-xl bg-secondary/50 border-transparent focus:border-primary resize-none"
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
                      className="flex-1 h-12 rounded-full bg-violet-500 hover:bg-violet-600 shadow-lg shadow-violet-500/20"
                    >
                      Registrar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Histórico Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Histórico de Uso
                </h2>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  {registros.length} registro{registros.length !== 1 ? 's' : ''}
                </span>
              </div>

              {registros.length === 0 ? (
                <Card className="border-0 shadow-sm p-8 text-center">
                  <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground mt-4">
                    Nenhum registro de cetim
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {registros.map((registro, index) => (
                    <Card 
                      key={registro.id}
                      data-testid={`registro-${registro.id}`}
                      className="border-0 shadow-sm bg-white"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-violet-600">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{registro.profissional}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(registro.data)} às {formatTime(registro.criadoEm)}
                              </span>
                            </div>
                            {registro.observacoes && (
                              <p className="mt-3 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                                {registro.observacoes}
                              </p>
                            )}
                          </div>
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
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-violet-500 hover:bg-violet-600 shadow-xl shadow-violet-500/30"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
