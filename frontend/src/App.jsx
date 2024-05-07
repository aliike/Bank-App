import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MoneyTransferScreen from './pages/MoneyTransferScreen';
import HistoryScreen from './pages/HistoryScreen';
import SwitftTransferScreen from './pages/SwitftTransferScreen';
import CreateInvestmentAccountScreen from './pages/CreateInvestmentAccountScreen';
import RepeatedMoneyScreen from './pages/RepeatedMoneyScreen';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/transfer/:id' element={<MoneyTransferScreen />} />
      <Route path='/swiftTransfer/:id' element={<SwitftTransferScreen />} />
      <Route path='/history/:customerNumber' element={<HistoryScreen />} />
      <Route path='/createInvestmentAccount/:id' element={<CreateInvestmentAccountScreen />} />
      <Route path='/repeatTransfer/:id' element={<RepeatedMoneyScreen />} />
    </Routes>
  );
};
export default App;
