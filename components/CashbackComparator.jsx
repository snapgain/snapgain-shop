import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, Award, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CashbackComparator = () => {
  const [formData, setFormData] = useState({
    cashbackRate: '',
    aviosRate: '',
    amount: ''
  });
  
  const [results, setResults] = useState(null);

  const AVIOS_PURCHASE_RATE = 0.0092;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateComparison = () => {
    const cashbackPercent = parseFloat(formData.cashbackRate) || 0;
    const aviosReceived = parseFloat(formData.aviosRate) || 0;
    const amount = parseFloat(formData.amount) || 0;

    if (amount <= 0) {
      setResults(null);
      return;
    }

    const cashbackValue = (cashbackPercent / 100) * amount;
    const aviosFromCashback = cashbackValue / AVIOS_PURCHASE_RATE;
    const totalAviosDirect = aviosReceived * amount;

    const bestOption = aviosFromCashback > totalAviosDirect ? 'Cashback' : 'Avios';

    setResults({
      cashbackValue,
      aviosFromCashback,
      totalAviosDirect,
      bestOption,
      amount,
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-snapgain-purple/10 rounded-2xl p-6 shadow-lg">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-snapgain-purple rounded-xl shadow-lg shadow-snapgain-purple/30">
          <Percent className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-snapgain-purple">Cashback vs Avios</h2>
          <p className="text-sm text-snapgain-purple/70">Earning Potential</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cashback">Cashback %</Label>
            <Input
              id="cashback"
              type="number"
              step="0.1"
              placeholder="e.g. 1.5"
              value={formData.cashbackRate}
              onChange={(e) => handleInputChange('cashbackRate', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="avios">Avios per £1</Label>
            <Input
              id="avios"
              type="number"
              step="0.1"
              placeholder="e.g. 1.0"
              value={formData.aviosRate}
              onChange={(e) => handleInputChange('aviosRate', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="amount-cb">Amount spent in £</Label>
          <Input
            id="amount-cb"
            type="number"
            step="0.01"
            placeholder="e.g. 100.00"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="mt-1"
          />
        </div>
        <Button
          onClick={calculateComparison}
          className="w-full bg-snapgain-green text-snapgain-purple font-bold text-base py-3 rounded-xl shadow-lg shadow-snapgain-green/30 hover:bg-snapgain-green-light transform hover:scale-105 transition-all duration-300"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Compare Returns
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
            Avios Potential
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col text-center">
              <span className="font-semibold text-sm mb-1 text-white/80">Via Cashback</span>
              <div className={`p-3 rounded-xl ${results.bestOption === 'Cashback' ? 'bg-snapgain-pink text-white' : 'bg-white/20'}`}>
                <p className="text-2xl font-extrabold">{Math.round(results.aviosFromCashback).toLocaleString()}</p>
                <p className="text-xs font-semibold opacity-80">Avios</p>
              </div>
            </div>
            <div className="flex flex-col text-center">
              <span className="font-semibold text-sm mb-1 text-white/80">Via Avios</span>
              <div className={`p-3 rounded-xl ${results.bestOption === 'Avios' ? 'bg-snapgain-pink text-white' : 'bg-white/20'}`}>
                <p className="text-2xl font-extrabold">{Math.round(results.totalAviosDirect).toLocaleString()}</p>
                <p className="text-xs font-semibold opacity-80">Avios</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-2 bg-black/20 rounded-lg">
            <p className="text-xs text-white/80 text-center">
              🏆 Best for £{results.amount.toFixed(2)}: <span className="font-bold">{results.bestOption}</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CashbackComparator;