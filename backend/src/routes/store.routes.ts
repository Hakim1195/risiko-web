// Store Routes for Risk Game
import { Router } from 'express';
import { StoreController } from '../controllers/store.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get all store items
router.get('/items', StoreController.getStoreItems);

// Get store item by ID
router.get('/items/:id', StoreController.getStoreItem);

// Get all season passes
router.get('/season-passes', StoreController.getSeasonPasses);

// Get user's balance
router.get('/balance', authMiddleware, StoreController.getBalance);

// Get user's bonuses
router.get('/bonuses', authMiddleware, StoreController.getBonuses);

// Get user's season pass benefits
router.get('/season-benefits', authMiddleware, StoreController.getSeasonBenefits);

// Get user's purchase history
router.get('/history', authMiddleware, StoreController.getPurchaseHistory);

// Get store statistics
router.get('/stats', StoreController.getStoreStats);

// Purchase an item
router.post('/purchase/item', authMiddleware, StoreController.purchaseItem);

// Purchase a season pass
router.post('/purchase/season-pass', authMiddleware, StoreController.purchaseSeasonPass);

export default router;
