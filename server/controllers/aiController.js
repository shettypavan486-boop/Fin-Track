import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import { generateAIInsights, predictExpense } from '../services/aiService.js';

export const generateInsights = async (req, res) => {
  try {
    console.log("========== AI DEBUG ==========");
    console.log("User ID:", req.userId);

    const transactions = await Transaction.find({
      userId: req.userId
    });

    console.log("Transactions Found:", transactions.length);
    console.log(transactions);

    const budget = await Budget.findOne({
      userId: req.userId
    });

    console.log("Budget:", budget);

    const result = await generateAIInsights({
      transactions,
      budget
    });

    console.log("AI Result:", result);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const predictSpending = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    const budget = await Budget.findOne({ userId: req.userId });
    const prediction = await predictExpense({ transactions, budget });

    res.status(200).json({
      success: true,
      data: prediction,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};