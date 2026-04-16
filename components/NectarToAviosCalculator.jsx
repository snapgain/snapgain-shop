import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const NectarToAviosCalculator = () => {
  const [nectarPoints, setNectarPoints] = useState(400);
  const [aviosValue, setAviosValue] = useState(0.01);

  const NECTAR_TO_AVIOS_RATE = 250 / 400;
  const NECTAR_POINT_VALUE_GBP = 0.005;

  const { convertedAvios, nectarValueGBP, convertedAviosValueGBP, isWorthIt, gainLossValue, gainLossPercentage } = useMemo(() => {
    const points = Number(nectarPoints) || 0;
    const avios = Math.floor(points * NECTAR_TO_AVIOS_RATE);
    const nectarGBP = points * NECTAR_POINT_VALUE_GBP;
    const aviosGBP = avios * aviosValue;
    const worthIt = aviosGBP > nectarGBP;
    const diff = aviosGBP - nectarGBP;
    const percentage = nectarGBP > 0 ? (diff / nectarGBP) * 100 : 0;

    return {
      convertedAvios: avios,
      nectarValueGBP: nectarGBP,
      convertedAviosValueGBP: aviosGBP,
      isWorthIt: worthIt,
      gainLossValue: diff,
      gainLossPercentage: percentage,
    };
  }, [nectarPoints, aviosValue]);

  const ResultCard = ({ title, value, currency = '£', className = '' }) => (
    <div className={`bg-white/50 p-4 rounded-lg text-center ${className}`}>
      <p className="text-sm text-snapgain-purple/70">{title}</p>
      <p className="text-2xl font-bold text-snapgain-purple">
        {currency}{value}
      </p>
    </div>
  );

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-snapgain-purple/10 rounded-2xl p-6 shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-snapgain-purple">Nectar ➔ Avios</h2>
          <p className="text-snapgain-purple/80">Is it worth converting?</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-snapgain-purple/50 hover:bg-snapgain-purple/10">
              <HelpCircle className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>How does the calculator work?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2 text-left">
                <p>This calculator helps you decide if it's beneficial to convert your Nectar points to Avios.</p>
                <p><strong>1. Nectar Points:</strong> Enter how many points you want to convert.</p>
                <p><strong>2. Value per Avios:</strong> Adjust the slider to the value in pounds (£) you assign to 1 Avios. This value is subjective and depends on how you use your Avios (flights, upgrades, etc.). A common valuation is £0.01.</p>
                <p>The calculator then compares the value your Nectar points would have at Sainsbury's (£0.005 per point) with the value the converted Avios would have, based on the valuation you've set.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-6">
        <div>
          <Label htmlFor="nectar-points">Nectar Points</Label>
          <Input
            id="nectar-points"
            type="number"
            value={nectarPoints}
            onChange={(e) => setNectarPoints(parseInt(e.target.value, 10) || 0)}
            placeholder="e.g. 400"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="avios-value">Value per Avios (£)</Label>
          <div className="flex items-center gap-4 mt-1">
            <Slider
              id="avios-value"
              min={0.005}
              max={0.03}
              step={0.0005}
              value={[aviosValue]}
              onValueChange={(value) => setAviosValue(value[0])}
            />
            <span className="font-bold text-snapgain-purple w-24 text-center">£{aviosValue.toFixed(4)}</span>
          </div>
        </div>
      </div>

      <div className="my-4 flex justify-center items-center">
        <ArrowRight className="w-8 h-8 text-snapgain-pink animate-pulse" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ResultCard title="Nectar Value" value={nectarValueGBP.toFixed(2)} />
        <ResultCard title="Avios Generated" value={convertedAvios.toLocaleString()} currency="" />
        <ResultCard title="Avios Value" value={convertedAviosValueGBP.toFixed(2)} />
        <div className={`p-4 rounded-lg text-center flex flex-col justify-center ${isWorthIt ? 'bg-snapgain-green-light' : 'bg-snapgain-pink-light'}`}>
          <p className="text-sm font-semibold">{isWorthIt ? 'Good deal!' : 'Not worth it'}</p>
          <div className={`flex items-center justify-center gap-2 text-xl font-bold ${isWorthIt ? 'text-snapgain-green' : 'text-snapgain-pink'}`}>
            {isWorthIt ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span>
              {gainLossValue >= 0 ? '+' : ''}£{gainLossValue.toFixed(2)}
            </span>
          </div>
          <p className={`text-xs font-semibold ${isWorthIt ? 'text-snapgain-green' : 'text-snapgain-pink'}`}>
            ({gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(1)}%)
          </p>
        </div>
      </div>
       <p className="text-xs text-center text-snapgain-purple/60 mt-4">
        Based on a 400 Nectar = 250 Avios rate. The break-even point is a value of £0.008 per Avios.
      </p>
    </div>
  );
};

export default NectarToAviosCalculator;