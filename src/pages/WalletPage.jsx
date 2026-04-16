import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plus, Trash2, Download, Coins, Edit, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const WalletPage = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState([]);
  const [aviosRate, setAviosRate] = useState(0.0092);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const newRowRef = useRef(null);

  useEffect(() => {
    const savedEntries = localStorage.getItem('walletEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('walletEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (editingRowId && newRowRef.current) {
      newRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editingRowId]);

  const handleAddRow = () => {
    const newEntry = {
      id: uuidv4(),
      platform: '',
      type: 'Cashback',
      value: '',
      notes: ''
    };
    setEntries(prev => [newEntry, ...prev]);
    setEditingRowId(newEntry.id);
    setEditingData(newEntry);
  };
  
  const handleEditRow = (entry) => {
    setEditingRowId(entry.id);
    setEditingData(entry);
  };

  const handleCancelEdit = () => {
    if(editingData.platform === '' && editingData.value === '' && entries.find(e => e.id === editingRowId)?.platform === '') {
        setEntries(entries.filter(e => e.id !== editingRowId));
    }
    setEditingRowId(null);
    setEditingData({});
  };

  const handleSaveRow = (id) => {
    setEntries(entries.map(entry => entry.id === id ? editingData : entry));
    setEditingRowId(null);
    setEditingData({});
    toast({
      title: '✅ Saved!',
      description: 'Your entry has been saved successfully.',
      className: 'bg-snapgain-green text-snapgain-purple',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prev => ({ ...prev, [name]: value}));
  }

  const handleDeleteRow = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };
  
  const handleClearWallet = () => {
    if (window.confirm('Are you sure you want to clear the entire wallet? This action cannot be undone.')) {
      setEntries([]);
      toast({
        title: '🗑️ Wallet Cleared!',
        description: 'All entries have been removed.',
        variant: 'destructive',
      });
    }
  };

  const totals = useMemo(() => {
    const totalCashback = entries
      .filter(e => e.type === 'Cashback')
      .reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);

    const totalAvios = entries
      .filter(e => e.type === 'Avios')
      .reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);

    const aviosValueInPounds = totalAvios * aviosRate;
    
    return { totalCashback, totalAvios, aviosValueInPounds };
  }, [entries, aviosRate]);

  const exportToCSV = () => {
    if (entries.length === 0) {
      toast({ title: '⚠️ Empty Wallet', description: 'There is no data to export.' });
      return;
    }
    const headers = 'Platform,Type,Value,Notes\n';
    const rows = entries.map(e => `"${e.platform}","${e.type}","${e.value}","${e.notes}"`).join('\n');
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'snapgain_wallet.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: '🚀 Exported!', description: 'Your CSV file has been downloaded.' });
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  return (
    <motion.main
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl p-6 sm:p-8 border border-snapgain-purple/20 shadow-xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-snapgain-purple rounded-xl shadow-lg shadow-snapgain-purple/30">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-snapgain-purple tracking-tight">My Wallet</h1>
            <p className="text-snapgain-purple/80">Your points and cashback control centre.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={handleAddRow} className="bg-snapgain-green text-snapgain-purple hover:bg-snapgain-green-light shadow-lg shadow-snapgain-green/30">
            <Plus size={18} className="mr-2" /> Add Entry
          </Button>
          <Button onClick={exportToCSV} variant="outline" className="text-snapgain-purple border-snapgain-purple hover:bg-snapgain-purple/10">
            <Download size={18} className="mr-2" /> Export CSV
          </Button>
          <Button onClick={handleClearWallet} variant="destructive" size="icon">
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-snapgain-green-light p-6 rounded-2xl border border-snapgain-green text-center">
          <h3 className="text-lg text-snapgain-purple font-semibold">Total Cashback</h3>
          <p className="text-4xl font-bold text-snapgain-purple">£{totals.totalCashback.toFixed(2)}</p>
        </div>
        <div className="bg-snapgain-purple/20 p-6 rounded-2xl border border-snapgain-purple text-center">
          <h3 className="text-lg text-snapgain-purple font-semibold">Total Avios</h3>
          <p className="text-4xl font-bold text-snapgain-purple">{totals.totalAvios.toLocaleString()} <span className="text-2xl opacity-80">pts</span></p>
        </div>
        <div className="bg-snapgain-pink-light p-6 rounded-2xl border border-snapgain-pink text-center">
          <h3 className="text-lg text-snapgain-purple font-semibold flex items-center justify-center gap-2">
            Avios Value in £ <Coins size={16}/>
          </h3>
          <p className="text-4xl font-bold text-snapgain-purple">£{totals.aviosValueInPounds.toFixed(2)}</p>
          <div className="mt-2 text-xs text-snapgain-purple/80 font-semibold">
            Rate: £<input type="number" value={aviosRate} onChange={e => setAviosRate(parseFloat(e.target.value) || 0)} className="w-20 bg-transparent border-b border-snapgain-pink text-center font-bold text-snapgain-purple" step="0.0001" /> per Avios
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-snapgain-purple/20">
              <th className="p-4 text-snapgain-purple font-bold">Platform</th>
              <th className="p-4 text-snapgain-purple font-bold">Type</th>
              <th className="p-4 text-snapgain-purple font-bold">Value</th>
              <th className="p-4 text-snapgain-purple font-bold">Notes</th>
              <th className="p-4 text-right text-snapgain-purple font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {entries.map((entry) => (
                <motion.tr 
                  key={entry.id} 
                  layout 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  ref={editingRowId === entry.id ? newRowRef : null}
                  className="border-b border-snapgain-purple/10"
                >
                  {editingRowId === entry.id ? (
                    <>
                      <td className="p-2"><Input name="platform" value={editingData.platform} onChange={handleInputChange} placeholder="Platform"/></td>
                      <td className="p-2">
                        <select name="type" value={editingData.type} onChange={handleSelectChange} className="h-10 w-full rounded-md border border-snapgain-purple/30 bg-white px-3 py-2 text-sm text-snapgain-purple focus:ring-snapgain-purple">
                          <option value="Cashback">Cashback</option>
                          <option value="Avios">Avios</option>
                        </select>
                      </td>
                      <td className="p-2"><Input name="value" type="number" value={editingData.value} onChange={handleInputChange} placeholder="Value"/></td>
                      <td className="p-2"><Input name="notes" value={editingData.notes} onChange={handleInputChange} placeholder="Notes"/></td>
                      <td className="p-2 text-right">
                        <Button onClick={() => handleSaveRow(entry.id)} size="sm" className="bg-snapgain-green text-snapgain-purple hover:bg-snapgain-green-light mr-2"><Save size={16}/></Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="ghost" className="text-snapgain-pink hover:bg-snapgain-pink/10"><X size={16}/></Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-semibold text-snapgain-purple">{entry.platform}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${entry.type === 'Cashback' ? 'bg-snapgain-green text-snapgain-purple' : 'bg-snapgain-purple text-white'}`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-snapgain-purple">{entry.type === 'Cashback' ? `£${parseFloat(entry.value || 0).toFixed(2)}` : `${parseFloat(entry.value || 0).toLocaleString()} pts`}</td>
                      <td className="p-4 text-snapgain-purple/70">{entry.notes}</td>
                      <td className="p-4 text-right">
                        <Button onClick={() => handleEditRow(entry)} size="icon" variant="ghost" className="mr-2 text-snapgain-purple hover:bg-snapgain-purple/10 hover:text-snapgain-purple h-9 w-9"><Edit size={16}/></Button>
                        <Button onClick={() => handleDeleteRow(entry.id)} size="icon" variant="ghost" className="text-snapgain-pink hover:bg-snapgain-pink/10 hover:text-snapgain-pink h-9 w-9"><Trash2 size={16}/></Button>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {entries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-snapgain-purple/60">Your wallet is empty.</p>
            <Button onClick={handleAddRow} className="mt-4 bg-snapgain-green text-snapgain-purple hover:bg-snapgain-green-light">Start by adding an entry!</Button>
          </div>
        )}
      </div>
    </motion.main>
  );
};

export default WalletPage;