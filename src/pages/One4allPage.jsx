import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Store, Search, Loader2, ServerCrash, ExternalLink, Wifi, Download, FilterX, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchFn } from '@/lib/functions.js';

const RetailerCard = ({ retailer }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="relative bg-white rounded-2xl p-4 border border-snapgain-purple/20 shadow-lg flex flex-col gap-4"
  >
    {!retailer.active && (
      <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow">
        <AlertTriangle size={12} /> Indisponivel
      </div>
    )}
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-white rounded-lg border border-snapgain-purple/10 flex items-center justify-center flex-shrink-0">
        <img
          alt={`${retailer.name} logo`}
          className="w-full h-full object-contain p-1"
          src={retailer.logo_url || 'https://images.unsplash.com/photo-1614312385003-dcea7b8b6ab6'}
        />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-snapgain-purple text-lg">{retailer.name}</h3>
        {retailer.accepts_online && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-snapgain-green bg-snapgain-green-light px-2 py-0.5 rounded-full mt-1">
            <Wifi size={12} /> Aceita Online
          </span>
        )}
      </div>
    </div>
    <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-snapgain-purple/10">
      <Button
        asChild
        variant="outline"
        size="sm"
        className="border-snapgain-purple/20 text-snapgain-purple hover:bg-snapgain-purple/5 hover:text-snapgain-purple"
      >
        <a href={`https://www.one4all.com${retailer.retailer_url}`} target="_blank" rel="noopener noreferrer">
          Ver na One4all <ExternalLink size={14} className="ml-2" />
        </a>
      </Button>
    </div>
  </motion.div>
);

const One4allPage = () => {
  const [retailers, setRetailers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [acceptsOnline, setAcceptsOnline] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { toast } = useToast();
  const page = useRef(0);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await fetchFn('one4all-categories');
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast({ variant: 'destructive', title: 'Erro ao buscar categorias.' });
    }
  }, [toast]);

  const fetchRetailers = useCallback(
    async (isNewSearch = false) => {
      if (isNewSearch) {
        page.current = 0;
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const params = {};
        if (debouncedSearchTerm) params.q = debouncedSearchTerm;
        if (selectedCategory) params.category = selectedCategory;
        if (acceptsOnline) params.online = 'true';

        const limit = 21;
        params.limit = String(limit);
        params.offset = String(page.current * limit);

        const res = await fetchFn('one4all-partners', { params });
        setRetailers(prev => (isNewSearch ? res.data : [...prev, ...res.data]));
        setTotalCount(res.count);
        page.current += 1;
      } catch (err) {
        console.error('Error fetching retailers:', err);
        setError('Não foi possível carregar os parceiros. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearchTerm, selectedCategory, acceptsOnline]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchRetailers(true);
  }, [debouncedSearchTerm, selectedCategory, acceptsOnline, fetchRetailers]);

  const invokeSyncFunction = async () => {
    toast({
      title: '⚡ Disparando atualização...',
      description: 'A sincronização com a One4all foi iniciada. Isso pode levar alguns minutos.'
    });
    try {
      // Usamos a função fetchFn que já lida com a autenticação
      const json = await fetchFn('admin-sync-one4all', { method: 'POST', auth: true });

      if (!json || json.ok === false) {
        throw new Error(json?.error || 'A resposta da sincronização foi inválida.');
      }
      
      toast({
        className: 'bg-snapgain-green text-snapgain-purple',
        title: '✅ Sincronização concluída!',
        description: `Total: ${json.total}, Desativados: ${json.deactivated}. A página será recarregada.`
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Falha ao sincronizar!', description: error.message || 'Ocorreu um erro desconhecido.' });
    }
  };

  const handleExport = () => {
    const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const exportUrl = `${FUNCTIONS_BASE}/one4all-export?apikey=${encodeURIComponent(SUPABASE_ANON_KEY)}`;
    window.open(exportUrl, '_blank');
    toast({ title: '📥 Exportando...', description: 'Seu download começará em breve.' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setAcceptsOnline(false);
  };

  return (
    <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-snapgain-purple rounded-xl shadow-lg shadow-snapgain-purple/30">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-snapgain-purple tracking-tight">Parceiros One4all</h1>
            <p className="text-snapgain-purple/80">Encontre onde usar seu cartão presente.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="border-snapgain-purple/20 text-snapgain-purple hover:bg-snapgain-purple/5 hover:text-snapgain-purple">
            <Download size={16} className="mr-2" /> Exportar CSV
          </Button>
          <Button onClick={invokeSyncFunction} className="bg-snapgain-pink text-white hover:bg-snapgain-pink/80">
            Sincronizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 bg-white p-6 rounded-2xl border border-snapgain-purple/10 shadow-lg self-start sticky top-28">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-snapgain-purple">Filtros</h2>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-snapgain-purple/70 hover:bg-snapgain-purple/10">
              <FilterX size={16} className="mr-2" /> Limpar
            </Button>
          </div>
          <div className="space-y-6">
            <div>
              <Label htmlFor="search">Buscar por nome</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-snapgain-purple/50" />
                <Input id="search" placeholder="Ex: Amazon, Just Eat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="accepts-online" checked={acceptsOnline} onCheckedChange={setAcceptsOnline} />
              <Label htmlFor="accepts-online">Aceita Online</Label>
            </div>
            <div>
              <h3 className="font-semibold text-snapgain-purple mb-3">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.slug ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory((prev) => (prev === category.slug ? null : category.slug))}
                    className="text-xs"
                  >
                    {category.name} ({category.retailer_count})
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="w-16 h-16 animate-spin text-snapgain-purple" />
            </div>
          ) : error ? (
            <div className="text-center bg-white p-8 rounded-2xl">
              <ServerCrash className="w-16 h-16 mx-auto text-snapgain-pink mb-4" />
              <h3 className="text-2xl font-bold text-snapgain-purple">Oops!</h3>
              <p className="text-snapgain-purple/80">{error}</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-snapgain-purple/80 font-semibold">{totalCount} parceiros encontrados.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>{retailers.map((retailer) => <RetailerCard key={retailer.slug} retailer={retailer} />)}</AnimatePresence>
              </div>
              {retailers.length < totalCount && (
                <div className="text-center mt-8">
                  <Button onClick={() => fetchRetailers(false)} disabled={loadingMore}>
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando...
                      </>
                    ) : (
                      'Carregar Mais'
                    )}
                  </Button>
                </div>
              )}
              {retailers.length === 0 && !loading && (
                <div className="text-center py-12 bg-white/50 rounded-2xl">
                  <p className="text-snapgain-purple/60 font-semibold text-lg">Nenhum parceiro encontrado.</p>
                  <p className="text-snapgain-purple/50">Tente ajustar seus filtros.</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </motion.main>
  );
};

export default One4allPage;