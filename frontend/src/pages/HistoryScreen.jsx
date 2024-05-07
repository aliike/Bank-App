import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useSnackbar } from 'notistack';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MdEventRepeat } from "react-icons/md";

const HistoryScreen = () => {

  const { customerNumber } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/history/all/${customerNumber}`)
      .then((response) => {
        setHistory(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  }, [customerNumber]);

  const filterTransactions = (type) => {
    if (activeFilter === type) {
      setFilteredHistory([]);
      setActiveFilter(null);
    } else {
      setFilteredHistory(history.filter(item => item.transferType === type));
      setActiveFilter(type);
    }
  };

  const filterTransactionsByAction = (action) => {
    if (activeFilter === action) {
      setFilteredHistory([]);
      setActiveFilter(null);
    } else {
      setFilteredHistory(history.filter(item => {
        if (action === 'SEND') {
          return item.senderCustomerNumber === customerNumber;
        } else if (action === 'RECEIVE') {
          return item.receiverCustomerNumber === customerNumber;
        }
        return false;
      }));
      setActiveFilter(action);
    }
  };

  const filterTransactionsByAmount = () => {
    if (!minAmount || !maxAmount) {
      enqueueSnackbar('Please enter both minimum and maximum amount.', { variant: 'error' });
      return;
    }

    const min = parseFloat(minAmount);
    const max = parseFloat(maxAmount);

    if (isNaN(min) || isNaN(max)) {
      enqueueSnackbar('Please enter valid numbers for minimum and maximum amount.', { variant: 'error' });
      return;
    }

    const filteredData = history.filter(item => {
      let amountToBeCalculated = parseFloat(item.amount);
      return amountToBeCalculated >= min && amountToBeCalculated <= max;
    });

    if (filteredData.length === 0) {
      enqueueSnackbar('No transactions found in the selected range.', { variant: 'error' });
    }

    setFilteredHistory(filteredData);
  };

  const filterTransactionsByDateRange = () => {
    if (!startDate || !endDate) {
      enqueueSnackbar('Please select both start and end dates.', { variant: 'error' });
      return;
    }

    const filteredData = history.filter(item => {
      const transactionDate = new Date(item.createdAt);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });

    if (filteredData.length === 0) {
      enqueueSnackbar('No transactions found in the selected date range.', { variant: 'error' });
    }

    setFilteredHistory(filteredData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='text-center'>
        <h1 className='text-3xl my-8'><em>Transaction History</em></h1>
      </div>
      <div className="table-responsive">
        {loading ? <Spinner /> : null}
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Transaction Type
                <div className="flex items-center mt-2">
                  <button
                    className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm ${activeFilter === 'EFT' ? 'bg-blue-700' : ''}`}
                    onClick={() => filterTransactions('EFT')}
                  >
                    EFT
                  </button>
                  <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm ${activeFilter === 'SWIFT' ? 'bg-blue-700' : ''}`}
                    onClick={() => filterTransactions('SWIFT')}
                  >
                    SWIFT
                  </button>
                </div>
              </th>
              <th className="px-4 py-2">To/From</th>
              <th className="px-4 py-2">Action
                <div className="flex items-center mt-2">
                  <button
                    className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm ${activeFilter === 'SEND' ? 'bg-blue-700' : ''}`}
                    onClick={() => filterTransactionsByAction('SEND')}
                  >
                    Send
                  </button>
                  <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm ${activeFilter === 'RECEIVE' ? 'bg-blue-700' : ''}`}
                    onClick={() => filterTransactionsByAction('RECEIVE')}
                  >
                    Receive
                  </button>
                </div>
              </th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Repeat</th>
            </tr>
          </thead>
          <tbody>
            {(filteredHistory.length > 0 ? filteredHistory : history).map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-2">{item.transferType}</td>
                <td className="px-4 py-2">{item.receiverCustomerNumber}</td>
                <td className="px-4 py-2" style={{ display: 'flex', alignItems: 'center' }}>
                  {item.senderCustomerNumber === customerNumber ? (
                    <>
                      <FaMinus style={{ marginRight: '4px', color: 'red' }} />
                      <span style={{ color: 'red' }}>SEND</span>
                    </>
                  ) : (
                    <>
                      <FaPlus style={{ marginRight: '4px', color: 'green' }} />
                      <span style={{ color: 'green' }}>RECEIVE</span>
                    </>
                  )}
                </td>
                <td className="px-4 py-2">
                  {item.currencyType === 'EUR' ? ((item.amount / 35)).toFixed(2) : (item.currencyType === 'TRY' ? item.amount.toFixed(2) : (item.amount / 32).toFixed(2))} {item.currencyType}
                </td>
                <td className="px-4 py-2">{item.comment}</td>
                <td className="px-4 py-2">
                  {(item.transferType === 'EFT' && item.senderCustomerNumber === customerNumber) && (
                    <Link to={`/repeatTransfer/${item._id}`}>
                      <MdEventRepeat className='text-red-600 text-3xl hover:text-black' />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Filtreleme bileşenleri */}
        <div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mr-2 px-2 py-1 border rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mr-2 px-2 py-1 border rounded"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm"
            onClick={filterTransactionsByDateRange}
          >
            Filter by Date
          </button>
        </div>
        <div className="flex items-center mt-2">
          <input
            type="text"
            placeholder="Min Amount (₺)"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="mr-2 px-2 py-1 border rounded"
          />
          <input
            type="text"
            placeholder="Max Amount (₺)"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="mr-2 px-2 py-1 border rounded"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm"
            onClick={filterTransactionsByAmount}
          >
            Filter by Amount
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;