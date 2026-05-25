// Store Controller for Risk Game
import { Request, Response } from 'express';
import { StoreService } from '../services/store.service';

export class StoreController {
  // Get all store items
  static async getStoreItems(req: Request, res: Response) {
    try {
      const items = await StoreService.getStoreItems();
      res.json({ success: true, items });
    } catch (error) {
      console.error('Error getting store items:', error);
      res.status(500).json({ success: false, message: 'Failed to get store items' });
    }
  }

  // Get store item by ID
  static async getStoreItem(req: Request, res: Response) {
    try {
      const itemId = parseInt(req.params.id);
      const item = await StoreService.getStoreItemById(itemId);
      
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      
      res.json({ success: true, item });
    } catch (error) {
      console.error('Error getting store item:', error);
      res.status(500).json({ success: false, message: 'Failed to get store item' });
    }
  }

  // Get all season passes
  static async getSeasonPasses(req: Request, res: Response) {
    try {
      const passes = await StoreService.getSeasonPasses();
      res.json({ success: true, seasonPasses: passes });
    } catch (error) {
      console.error('Error getting season passes:', error);
      res.status(500).json({ success: false, message: 'Failed to get season passes' });
    }
  }

  // Purchase an item
  static async purchaseItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { itemId, quantity = 1 } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const result = await StoreService.purchaseItem(userId, itemId, quantity);
      res.json(result);
    } catch (error) {
      console.error('Error purchasing item:', error);
      res.status(500).json({ success: false, message: 'Failed to purchase item' });
    }
  }

  // Purchase a season pass
  static async purchaseSeasonPass(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { seasonPassId } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const result = await StoreService.purchaseSeasonPass(userId, seasonPassId);
      res.json(result);
    } catch (error) {
      console.error('Error purchasing season pass:', error);
      res.status(500).json({ success: false, message: 'Failed to purchase season pass' });
    }
  }

  // Get user's purchase history
  static async getPurchaseHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const history = await StoreService.getUserPurchaseHistory(userId);
      res.json({ success: true, history });
    } catch (error) {
      console.error('Error getting purchase history:', error);
      res.status(500).json({ success: false, message: 'Failed to get purchase history' });
    }
  }

  // Get user's balance
  static async getBalance(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const balance = await StoreService.getUserBalance(userId);
      res.json({ success: true, balance });
    } catch (error) {
      console.error('Error getting balance:', error);
      res.status(500).json({ success: false, message: 'Failed to get balance' });
    }
  }

  // Get user's bonuses
  static async getBonuses(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const bonuses = await StoreService.getUserBonuses(userId);
      res.json({ success: true, bonuses });
    } catch (error) {
      console.error('Error getting bonuses:', error);
      res.status(500).json({ success: false, message: 'Failed to get bonuses' });
    }
  }

  // Get user's season pass benefits
  static async getSeasonBenefits(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const benefits = await StoreService.getUserSeasonBenefits(userId);
      res.json({ success: true, ...benefits });
    } catch (error) {
      console.error('Error getting season benefits:', error);
      res.status(500).json({ success: false, message: 'Failed to get season benefits' });
    }
  }

  // Get store statistics
  static async getStoreStats(req: Request, res: Response) {
    try {
      const stats = await StoreService.getStoreStats();
      res.json({ success: true, stats });
    } catch (error) {
      console.error('Error getting store stats:', error);
      res.status(500).json({ success: false, message: 'Failed to get store stats' });
    }
  }
}
