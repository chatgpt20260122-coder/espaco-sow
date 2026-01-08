import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Plus, Package, Trash2, Minus, AlertTriangle, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Estoque() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useLocalStorage('espacosow_estoque', []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    quantidadeMinima: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || formData.quantidade === '') {
      toast.error('Preencha nome e quantidade');
      return;
    }

    const novoProduto = {
      id: Date.now().toString(),
      nome: formData.nome,
      quantidade: parseInt(formData.quantidade) || 0,
      quantidadeMinima: parseInt(formData.quantidadeMinima) || 0,
      criadoEm: new Date().toISOString()
    };

    setProdutos([...produtos, novoProduto]);
    setFormData({ nome: '', quantidade: '', quantidadeMinima: '' });
    setShowForm(false);
    toast.success('Produto adicionado!');
  };

  const ajustarQuantidade = (id, delta) => {
    setProdutos(produtos.map(p => {
      if (p.id === id) {
        const novaQtd = Math.max(0, p.quantidade + delta);
        if (novaQtd <= p.quantidadeMinima && p.quantidadeMinima > 0) {
          toast.warning(`Estoque baixo: ${p.nome}!`);
        }
        return { ...p, quantidade: novaQtd };
      }
      return p;
    }));
  };

  const removerProduto = (id) => {
    setProdutos(produtos.filter(p => p.id !== id));
    toast.success('Produto removido!');
  };

  const iniciarEdicao = (produto) => {
    setEditingId(produto.id);
    setFormData({
      nome: produto.nome,
      quantidade: produto.quantidade.toString(),
      quantidadeMinima: produto.quantidadeMinima.toString()
    });
  };

  const salvarEdicao = (id) => {
    setProdutos(produtos.map(p => {
      if (p.id === id) {
        return {
          ...p,
          nome: formData.nome,
          quantidade: parseInt(formData.quantidade) || 0,
          quantidadeMinima: parseInt(formData.quantidadeMinima) || 0
        };
      }
      return p;
    }));
    setEditingId(null);
    setFormData({ nome: '', quantidade: '', quantidadeMinima: '' });
    toast.success('Produto atualizado!');
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setFormData({ nome: '', quantidade: '', quantidadeMinima: '' });
  };

  const produtosOrdenados = [...produtos].sort((a, b) => {
    // Produtos com estoque baixo primeiro
    const aLow = a.quantidade <= a.quantidadeMinima && a.quantidadeMinima > 0;
    const bLow = b.quantidade <= b.quantidadeMinima && b.quantidadeMinima > 0;
    if (aLow && !bLow) return -1;
    if (!aLow && bLow) return 1;
    return a.nome.localeCompare(b.nome);
  });

  const produtosBaixos = produtos.filter(p => 
    p.quantidade <= p.quantidadeMinima && p.quantidadeMinima > 0
  ).length;

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
              <Package className="w-5 h-5 text-emerald-500" />
              <h1 className="text-xl font-semibold">Controle de Estoque</h1>
            </div>
          </div>
        </header>

        {/* Alerta de estoque baixo */}
        {produtosBaixos > 0 && (
          <div 
            data-testid="alerta-estoque"
            className="mx-4 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
            <span className="text-sm text-destructive font-medium">
              {produtosBaixos} produto{produtosBaixos > 1 ? 's' : ''} com estoque baixo
            </span>
          </div>
        )}

        {/* Content */}
        <main className="px-4 py-6">
          {showForm ? (
            <Card className="border-0 shadow-lg" data-testid="form-estoque">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Novo Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nome do Produto *
                    </label>
                    <Input
                      data-testid="input-nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: Shampoo, Condicionador..."
                      className="mt-1 h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary"
                      autoComplete="off"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Quantidade Atual *
                      </label>
                      <Input
                        data-testid="input-quantidade"
                        type="number"
                        min="0"
                        value={formData.quantidade}
                        onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                        placeholder="0"
                        className="mt-1 h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Quantidade Mínima
                      </label>
                      <Input
                        data-testid="input-minima"
                        type="number"
                        min="0"
                        value={formData.quantidadeMinima}
                        onChange={(e) => setFormData({ ...formData, quantidadeMinima: e.target.value })}
                        placeholder="0"
                        className="mt-1 h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    * Alerta será exibido quando a quantidade atual for igual ou menor que a mínima
                  </p>
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
                      className="flex-1 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                    >
                      Adicionar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Produtos Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Produtos Cadastrados
                </h2>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  {produtos.length} produto{produtos.length !== 1 ? 's' : ''}
                </span>
              </div>

              {produtos.length === 0 ? (
                <Card className="border-0 shadow-sm p-8 text-center">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground mt-4">
                    Nenhum produto cadastrado
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {produtosOrdenados.map((produto) => {
                    const estoqueBaixo = produto.quantidade <= produto.quantidadeMinima && produto.quantidadeMinima > 0;
                    const isEditing = editingId === produto.id;

                    return (
                      <Card 
                        key={produto.id}
                        data-testid={`produto-${produto.id}`}
                        className={`border-0 shadow-sm transition-all ${
                          estoqueBaixo 
                            ? 'bg-destructive/5 ring-2 ring-destructive/20' 
                            : 'bg-white'
                        }`}
                      >
                        <CardContent className="p-4">
                          {isEditing ? (
                            <div className="space-y-3">
                              <Input
                                data-testid="edit-nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className="h-10 rounded-lg"
                                autoComplete="off"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  data-testid="edit-quantidade"
                                  type="number"
                                  min="0"
                                  value={formData.quantidade}
                                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                                  placeholder="Qtd"
                                  className="h-10 rounded-lg"
                                />
                                <Input
                                  data-testid="edit-minima"
                                  type="number"
                                  min="0"
                                  value={formData.quantidadeMinima}
                                  onChange={(e) => setFormData({ ...formData, quantidadeMinima: e.target.value })}
                                  placeholder="Mín"
                                  className="h-10 rounded-lg"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  data-testid="btn-salvar-edicao"
                                  onClick={() => salvarEdicao(produto.id)}
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                                >
                                  <Check className="w-4 h-4 mr-1" /> Salvar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-testid="btn-cancelar-edicao"
                                  onClick={cancelarEdicao}
                                  className="flex-1"
                                >
                                  <X className="w-4 h-4 mr-1" /> Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  {estoqueBaixo && (
                                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                                  )}
                                  <h3 className="font-medium truncate">
                                    {produto.nome}
                                  </h3>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Mínimo: {produto.quantidadeMinima}
                                </p>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  data-testid={`btn-menos-${produto.id}`}
                                  onClick={() => ajustarQuantidade(produto.id, -1)}
                                  className="h-9 w-9 rounded-full"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span 
                                  data-testid={`qtd-${produto.id}`}
                                  className={`w-12 text-center font-semibold text-lg ${
                                    estoqueBaixo ? 'text-destructive' : 'text-foreground'
                                  }`}
                                >
                                  {produto.quantidade}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  data-testid={`btn-mais-${produto.id}`}
                                  onClick={() => ajustarQuantidade(produto.id, 1)}
                                  className="h-9 w-9 rounded-full"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  data-testid={`btn-editar-${produto.id}`}
                                  onClick={() => iniciarEdicao(produto)}
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  data-testid={`btn-remover-${produto.id}`}
                                  onClick={() => removerProduto(produto.id)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* FAB */}
        {!showForm && !editingId && (
          <Button
            data-testid="btn-adicionar"
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/30"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
