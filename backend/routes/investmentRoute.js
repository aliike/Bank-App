import express from 'express';
import { Investment } from '../models/investmentModel.js'


const router = express.Router();


router.post('/:id', async (request, response) => {
    try {
      if (!request.body.accountName || !request.body.accountCurrencyType) {
        return response.status(400).send({
          message: 'Send all required fields: accountName, accountCurrencyType',
        });
      }
      
      const newInvsAccount = {
        connectedAccount: request.body.connectedAccount,
        accountName: request.body.accountName,
        accountCurrencyType : request.body.accountCurrencyType
      }
      
      const account = await Investment.create(newInvsAccount);
      return response.status(200).send({ message: 'New invs account created.' })
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

  router.get('/getByConnectedAccount/:connectedAccount', async (request, response) => {
    try {
      const connectedAccount = request.params.connectedAccount;
      const accounts = await Investment.find({ connectedAccount });
      return response.status(200).json(accounts);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
});


export default router;