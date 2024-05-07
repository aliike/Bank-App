import express from 'express';
import { Account } from '../models/accountModel.js';
import { History } from '../models/historyModel.js';


const router = express.Router();


router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const account = await Account.findById(id);

    return response.status(200).json(account);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


router.get('/no/:customerNumber', async (request, response) => {
  try {
    const { customerNumber } = request.params;
    const account = await Account.findOne({ customerNumber: customerNumber });
    if (!account) {
      return response.status(404).json({ message: 'Account not found' });
    }
    return response.status(200).json(account);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});



router.put('/:id', async (request, response) => {
  try {
    if (!request.body.balance) {
      return response.status(400).send({
        message: 'Send all required fields: balance',
      });
    }
    const { id } = request.params;
    const result = await Account.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Account not found' });
    }

    return response.status(200).send({ message: 'Balance updated successfully' })
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});



router.put('/applyTransformation/:id', async (request, response) => {
  try {
    const { amount, iban, comment, currencyType, transferType, addToAccountList } = request.body;
    console.log(addToAccountList)


    if (!amount || !iban || !currencyType) {
      return response.status(400).json({
        message: 'Send all required fields: amount, iban, currencyType, comment',
      });
    }
    if (isNaN(parseFloat(amount)) || !isFinite(amount) || parseFloat(amount) <= 0) {
      return response.status(400).json({
        message: 'Amount must be a positive number',
      });
    }

    const { id } = request.params;


    const senderAccount = await Account.findById(id);
    if (!senderAccount) {
      return response.status(404).json({ message: 'Account not found' });
    }

    const senderBalance = parseFloat(senderAccount.balance);
    let transferAmount = parseFloat(amount);

    if (currencyType == 'USD') transferAmount = transferAmount * 32;
    else if (currencyType == 'EUR') transferAmount = transferAmount * 35;

    if (senderBalance < transferAmount + (transferAmount * 0.05)) {
      return response.status(404).json({ message: 'Insufficient balance' });
    }

    const receiverAccount = await Account.findOne({ ibanNumber: iban });
    if (!receiverAccount) {
      return response.status(404).json({ message: 'Receiver account not found' });
    }
    if (addToAccountList) {
      if (!senderAccount.registeredIbans.includes(receiverAccount.customerNumber)) {
        senderAccount.registeredIbans.push(receiverAccount.customerNumber);
      } 
    }
    
    senderAccount.balance -= transferAmount + (transferAmount * 0.05);
    await senderAccount.save();

    const receiverBalance = parseInt(receiverAccount.balance);
    receiverAccount.balance = receiverBalance + transferAmount;
    await receiverAccount.save();


    const transferDetails = {
      senderCustomerNumber: senderAccount.customerNumber,
      receiverCustomerNumber: receiverAccount.customerNumber,
      amount: transferAmount,
      transferType: transferType,
      comment: comment ? comment : '',
      currencyType: currencyType,
    };

    const details = await History.create(transferDetails);

    return response.status(200).json({ message: 'Transfer completed successfully' });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/byCustomerNumber/applyTransformation/:customerNumber', async (request, response) => {
  try {
    const { amount, iban, comment, currencyType, transferType, addToAccountList, customerNumber } = request.body;



    if (!amount || !iban || !currencyType) {
      return response.status(400).json({
        message: 'Send all required fields: amount, iban, currencyType, comment',
      });
    }
    if (isNaN(parseFloat(amount)) || !isFinite(amount) || parseFloat(amount) <= 0) {
      return response.status(400).json({
        message: 'Amount must be a positive number',
      });
    }


    const senderAccount = await Account.findOne({customerNumber});
    if (!senderAccount) {
      return response.status(404).json({ message: 'Account not found' });
    }

    const senderBalance = parseFloat(senderAccount.balance);
    let transferAmount = parseFloat(amount);

    if (currencyType == 'USD') transferAmount = transferAmount * 32;
    else if (currencyType == 'EUR') transferAmount = transferAmount * 35;

    if (senderBalance < transferAmount + (transferAmount * 0.05)) {
      return response.status(404).json({ message: 'Insufficient balance' });
    }

    const receiverAccount = await Account.findOne({ ibanNumber: iban });
    if (!receiverAccount) {
      return response.status(404).json({ message: 'Receiver account not found' });
    }
    if (addToAccountList) {
      if (!senderAccount.registeredIbans.includes(receiverAccount.customerNumber)) {
        senderAccount.registeredIbans.push(receiverAccount.customerNumber);
      } 
    }
    
    senderAccount.balance -= transferAmount + (transferAmount * 0.05);
    await senderAccount.save();

    const receiverBalance = parseInt(receiverAccount.balance);
    receiverAccount.balance = receiverBalance + transferAmount;
    await receiverAccount.save();


    const transferDetails = {
      senderCustomerNumber: senderAccount.customerNumber,
      receiverCustomerNumber: receiverAccount.customerNumber,
      amount: transferAmount,
      transferType: transferType,
      comment: comment ? comment : '',
      currencyType: currencyType,
    };

    const details = await History.create(transferDetails);

    return response.status(200).json({ message: 'Transfer completed successfully' });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: 'Internal server error' });
  }
});


export default router;