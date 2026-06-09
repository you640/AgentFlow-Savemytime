export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title: string, body: string, icon = '/favicon.ico') => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon,
      badge: icon,
      // @ts-ignore
      vibrate: [200, 100, 200],
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

export const simulateIncomingEvent = (type: 'task' | 'error' | 'message') => {
  const events = {
    task: {
      title: 'Workflow Completed ✅',
      body: 'Order #8921 processed and invoice sent via SuperFaktura.',
    },
    error: {
      title: 'Agent Attention Required ⚠️',
      body: 'Shopify API returned a 401. Re-authentication might be needed.',
    },
    message: {
      title: 'Urgent Message 📩',
      body: 'New high-priority inquiry from Milan K. regarding delivery.',
    }
  };

  const event = events[type];
  sendNotification(event.title, event.body);
};
