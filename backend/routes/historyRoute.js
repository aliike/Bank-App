import express from 'express';
import { History } from '../models/historyModel.js'


const router = express.Router();



router.get('/id/:id', async (request, response) => {
  try {
    const { id } = request.params
    const history = await History.findById(id)
    if (!history) {
      return response.status(404).json({ message: 'History not found' });
    }
    return response.status(200).json(history);

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


router.get('/:senderCustomerNumber', async (request, response) => {
  try {
    const { senderCustomerNumber } = request.params
    const history = await History.find({ senderCustomerNumber })
    if (!history) {
      return response.status(404).json({ message: 'History not found' });
    }
    return response.status(200).json(history);

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get('/r/:receiverCustomerNumber', async (request, response) => {
  try {
    const { receiverCustomerNumber } = request.params
    const history = await History.find({ receiverCustomerNumber: receiverCustomerNumber })
    if (!history) {
      return response.status(404).json({ message: 'History not found' });
    }
    return response.status(200).json(history);

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get('/all/:customerNumber', async (request, response) => {
  try {
    const { customerNumber } = request.params
    const history = await History.find({ $or: [{ senderCustomerNumber: customerNumber }, { receiverCustomerNumber: customerNumber }] });
    if (!history) {
      return response.status(404).json({ message: 'History not found' });
    }
    return response.status(200).json(history);

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});









export default router;