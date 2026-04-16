import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Repeat, Award, Calculator } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    
    const revolutPlans = {
      'plus': 10,
      'premium': 4,
      'metal': 2,
      'ultra': 1,
    };
    
    const RevolutVsAviosCalculator = () => {
      const [formData, setFormData] = useState({
        revolutPlan: 'premium',
        revolutShopRate: '',
        amount: '',
        aviosRate: ''
      });
      
      const [results, setResults] = useState(null);
    
      const handleInputChange = (field, value) => {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      };
      
      const handleSelectChange = (value) => {
        setFormData(prev => ({
          ...prev,
          revolutPlan: value
        }));
      };
    
      const calculatePoints = () => {
        const divisor = revolutPlans[formData.revolutPlan];
        const amount = parseFloat(formData.amount) || 0;
        const aviosRate = parseFloat(formData.aviosRate) || 0;
        const revolutShopRate = parseFloat(formData.revolutShopRate) || 1;
    
        if (amount <= 0) {
          setResults(null);
          return;
        }
    
        const aviosViaRevolut = (amount / divisor) * revolutShopRate;
        const aviosDirectos = amount * aviosRate;
        
        const bestStrategy = aviosViaRevolut > aviosDirectos ? 'Revolut' : 'Avios Direto';
    
        setResults({
          aviosViaRevolut,
          aviosDirectos,
          bestStrategy,
          amount
        });
      };
    
      return (
        <div className="bg-white/70 backdrop-blur-sm border border-snapgain-purple/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-snapgain-purple rounded-xl shadow-lg shadow-snapgain-purple/30">
              <Repeat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-snapgain-purple">Revolut vs Avios</h2>
              <p className="text-sm text-snapgain-purple/70">Estratégia de Acúmulo</p>
            </div>
          </div>
    
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="revolut-plan-avios">Plano Revolut</Label>
                <Select onValueChange={handleSelectChange} defaultValue={formData.revolutPlan}>
                  <SelectTrigger id="revolut-plan-avios" className="mt-1">
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plus">Plus (1 pt / £10)</SelectItem>
                    <SelectItem value="premium">Premium (1 pt / £4)</SelectItem>
                    <SelectItem value="metal">Metal (1 pt / £2)</SelectItem>
                    <SelectItem value="ultra">Ultra (1 pt / £1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="revolut-shop-rate">Revpoints na Revolut Shop</Label>
                <Input
                  id="revolut-shop-rate"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 10"
                  value={formData.revolutShopRate}
                  onChange={(e) => handleInputChange('revolutShopRate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="amount-rev-avios">Valor da compra em £</Label>
                <Input
                  id="amount-rev-avios"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 100.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="avios-direct-rate-comp">Avios por £1 (Direto)</Label>
                <Input
                  id="avios-direct-rate-comp"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 1.5"
                  value={formData.aviosRate}
                  onChange={(e) => handleInputChange('aviosRate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
    
            <Button
              onClick={calculatePoints}
              className="w-full bg-snapgain-green text-snapgain-purple font-bold text-base py-3 rounded-xl shadow-lg shadow-snapgain-green/30 hover:bg-snapgain-green-light transform hover:scale-105 transition-all duration-300"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Comparar Acúmulo
            </Button>
          </div>
    
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 bg-snapgain-purple text-white rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-snapgain-green-light" />
                Resultados da Comparação
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col text-center">
                  <span className="font-semibold text-sm mb-1 text-white/80">Avios via Revolut</span>
                  <div className={`p-3 rounded-xl ${results.bestStrategy === 'Revolut' ? 'bg-snapgain-pink text-white' : 'bg-white/20'}`}>
                    <p className="text-2xl font-extrabold">{Math.round(results.aviosViaRevolut).toLocaleString()}</p>
                    <p className="text-xs font-semibold opacity-80">Avios</p>
                  </div>
                </div>
                <div className="flex flex-col text-center">
                  <span className="font-semibold text-sm mb-1 text-white/80">Avios Diretos</span>
                  <div className={`p-3 rounded-xl ${results.bestStrategy === 'Avios Direto' ? 'bg-snapgain-pink text-white' : 'bg-white/20'}`}>
                    <p className="text-2xl font-extrabold">{Math.round(results.aviosDirectos).toLocaleString()}</p>
                    <p className="text-xs font-semibold opacity-80">Avios</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-2 bg-black/20 rounded-lg">
                <p className="text-xs text-white/80 text-center">
                  🏆 Melhor opção para £{parseFloat(results.amount).toFixed(2)}: <span className="font-bold">{results.bestStrategy}</span>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      );
    };
    
    export default RevolutVsAviosCalculator;