import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AviosComparator = () => {
  const [formData, setFormData] = useState({
    nectarRate: '',
    aviosRate: '',
    amount: ''
  });
  
  const [results, setResults] = useState(null);

  const NECTAR_TO_AVIOS_RATE = 0.625;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateAvios = () => {
    const nectarPointsPerPound = parseFloat(formData.nectarRate) || 0;
    const aviosPointsPerPound = parseFloat(formData.aviosRate) || 0;
    const amount = parseFloat(formData.amount) || 0;

    if (amount <= 0) {
      setResults(null);
      return;
    }

    const totalViaNectar = amount * nectarPointsPerPound * NECTAR_TO_AVIOS_RATE;
    const totalViaAvios = amount * aviosPointsPerPound;

    const bestStrategy = totalViaNectar > totalViaAvios ? 'Nectar' : 'Avios';

    setResults({
      totalViaNectar,
      totalViaAvios,
      bestStrategy,
      amount
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-snapgain-purple/10 rounded-2xl p-6 shadow-lg">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-snapgain-purple rounded-xl shadow-lg shadow-snapgain-purple/30">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-snapgain-purple">Nectar vs Avios</h2>
          <p className="text-sm text-snapgain-purple/70">Points Conversion</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nectar">Nectar per £1</Label>
            <Input
              id="nectar"
              type="number"
              step="0.1"
              placeholder="e.g. 5"
              value={formData.nectarRate}
              onChange={(e) => handleInputChange('nectarRate', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="avios-rate">Avios per £1</Label>
            <Input
              id="avios-rate"
              type="number"
              step="0.1"
              placeholder="e.g. 1"
              value={formData.aviosRate}
              onChange={(e) => handleInputChange('aviosRate', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="amount">Amount spent in £</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="e.g. 100.00"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="mt-1"
          />
        </div>
        <Button
          onClick={calculateAvios}
          className="w-full bg-snapgain-green text-snapgain-purple font-bold text-base py-3 rounded-xl shadow-lg shadow-snapgain-green/30 hover:bg-snapgain-green-light transform hover:scale-105 transition-all duration-300"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Compare
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
            Comparison Results
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col text-center">
              <span className="font-semibold text-sm mb-1 text-white/80">Via Nectar</span>
              <div className={`p-3 rounded-xl ${results.bestStrategy === 'Nectar' ? 'bg-snapgain-pink text-white' : 'bg-white/20'}`}>
                <p className="text-2xl font-extrabold">{Math.round(results.totalViaNectar).toLocaleString()}</p>
                <p className="text-xs font-semibold opacity-80">Avios</p>
              </div>
            </div>
            <div className="flex flex-col text-center">
              <span className="font-semibold text-sm mb-1 text-white/80">Via Avios</span>
              <div className={`p-3 rounded-xl ${results.bestStrategy === 'Avios' ? 'bg-snapgain-pink text-white' : 'bg-white/20'}`}>
                <p className="text-2xl font-extrabold">{Math.round(results.totalViaAvios).toLocaleString()}</p>
                <p className="text-xs font-semibold opacity-80">Avios</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-2 bg-black/20 rounded-lg">
            <p className="text-xs text-white/80 text-center">
              🏆 Best for £{results.amount.toFixed(2)}: <span className="font-bold">{results.bestStrategy}</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AviosComparator;