const Notification = require('../models/notifications');

const notificationsController = {
  createNotification: async (req, res) => {
    try {
      const { heading, body, isLive } = req.body;
      const newNotification = new Notification({ heading, body, isLive });
      const savedNotification = await newNotification.save();
      res.status(201).json(savedNotification);
    } catch (error) {
      res.status(500).json({ error: 'Error creating notification' });
    }
  },
  unliveNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await Notification.findByIdAndUpdate(id, { isLive: false }, { new: true });
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Error updating notification' });
    }
  },
  getNotification: async (req, res) => {
    try {
      const notifications = await Notification.find();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching notifications' });
    }
  },
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedNotification = await Notification.findByIdAndDelete(id);
      if (!deletedNotification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting notification' });
    }
  }
};

module.exports = notificationsController;
