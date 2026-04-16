import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RevolutShopComparator = () => {
  const [formData, setFormData] = useState({
    revPointsShopRate: '',
    aviosShopRate: '',
    amount: ''
  });
  
  const [results, setResults] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateComparison = () => {
    const revPointsRate = parseFloat(formData.revPointsShopRate) || 0;
    const aviosRate = parseFloat(formData.aviosShopRate) || 0;
    const amount = parseFloat(formData.amount) || 0;

    if (amount <= 0) {
      setResults(null);
      return;
    }

    const totalRevPoints = revPointsRate * amount;
    const totalAvios = aviosRate * amount;

    const bestStrategy = totalRevPoints > totalAvios ? 'Revolut' : 'Avios';

    setResults({
      totalRevPoints,
      totalAvios,
      bestStrategy,
      amount
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="revpoints-shop-rate">
              RevPoints/£ (Loja)
            </Label>
            <Input
              id="revpoints-shop-rate"
              type="number"
              step="0.1"
              placeholder="Ex: 10"
              value={formData.revPointsShopRate}
              onChange={(e) => handleInputChange('revPointsShopRate', e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="avios-shop-rate">
              Avios/£ (Loja)
            </Label>
            <Input
              id="avios-shop-rate"
              type="number"
              step="0.1"
              placeholder="Ex: 8"
              value={formData.aviosShopRate}
              onChange={(e) => handleInputChange('aviosShopRate', e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="amount-shop">
            Valor gasto em £
          </Label>
          <Input
            id="amount-shop"
            type="number"
            step="0.01"
            placeholder="Ex: 50.00"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="mt-2"
          />
        </div>

        <Button
          onClick={calculateComparison}
          className="w-full bg-snapgain-green text-snapgain-purple font-bold text-base py-3 rounded-xl shadow-lg shadow-snapgain-green/30 hover:bg-snapgain-green-light transform hover:scale-105 transition-all duration-300"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Comparar Lojas
        </Button>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-snapgain-purple text-white rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-snapgain-green-light" />
            Resultados da Comparação
          </h3>

          <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col text-center">
                  <span className="font-semibold text-sm mb-1 text-white/80">Revolut</span>
                  <div className={`p-4 rounded-xl ${results.bestStrategy === 'Revolut' ? 'bg-snapgain-pink text-white' : 'bg-white/20'}`}>
                      <p className="text-3xl font-extrabold">{Math.round(results.totalRevPoints).toLocaleString()}</p>
                      <p className="text-xs font-semibold opacity-80">Pontos Gerados</p>
                      {results.bestStrategy === 'Revolut' && (
                          <Button size="sm" className="mt-2 bg-white text-snapgain-pink font-bold px-3 py-1 h-auto rounded-full cursor-default">MELHOR</Button>
                      )}
                  </div>
              </div>
              <div className="flex flex-col text-center">
                  <span className="font-semibold text-sm mb-1 text-white/80">Avios</span>
                   <div className={`p-4 rounded-xl ${results.bestStrategy === 'Avios' ? 'bg-snapgain-pink text-white' : 'bg-white/20'}`}>
                      <p className="text-3xl font-extrabold">{Math.round(results.totalAvios).toLocaleString()}</p>
                      <p className="text-xs font-semibold opacity-80">Pontos Gerados</p>
                       {results.bestStrategy === 'Avios' && (
                          <Button size="sm" className="mt-2 bg-white text-snapgain-pink font-bold px-3 py-1 h-auto rounded-full cursor-default">MELHOR</Button>
                      )}
                  </div>
              </div>
          </div>
          
          <div className="mt-4 p-3 bg-snapgain-purple/50 rounded-xl">
            <p className="text-xs text-white/80 text-center">
              🏆 Melhor para £{results.amount.toFixed(2)}: <span className="font-bold">{results.bestStrategy}</span>. Lembre-se que 1 RevPoint = 1 Avios.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RevolutShopComparator;